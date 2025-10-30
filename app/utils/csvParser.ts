import Papa from 'papaparse';
import { Sighting, SightingStats } from '../types/sighting';

export async function parseSightingsCSV(): Promise<Sighting[]> {
  const response = await fetch('/ghost_sightings_12000_with_images.csv');
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const sightings = results.data.map((row: any) => ({
          dateOfSighting: row['Date of Sighting'] || '',
          latitude: parseFloat(row['Latitude of Sighting']) || 0,
          longitude: parseFloat(row['Longitude of Sighting']) || 0,
          city: row['Nearest Approximate City'] || '',
          state: row['US State'] || '',
          notes: row['Notes about the sighting'] || '',
          timeOfDay: row['Time of Day'] || '',
          tag: row['Tag of Apparition'] || '',
          imageLink: row['Image Link'] || '',
        })).filter((sighting: Sighting) => 
          sighting.latitude !== 0 && sighting.longitude !== 0
        );
        resolve(sightings);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function calculateStats(sightings: Sighting[]): SightingStats {
  if (sightings.length === 0) {
    return {
      totalSightings: 0,
      mostRecentDate: 'N/A',
      mostGhostlyCity: 'N/A',
    };
  }

  // Find most recent sighting
  const sortedByDate = [...sightings].sort((a, b) => 
    new Date(b.dateOfSighting).getTime() - new Date(a.dateOfSighting).getTime()
  );
  
  const mostRecentDate = sortedByDate[0]?.dateOfSighting || 'N/A';

  // Find most ghostly city
  const cityCounts = sightings.reduce((acc, sighting) => {
    const cityState = `${sighting.city}, ${sighting.state}`;
    acc[cityState] = (acc[cityState] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostGhostlyCity = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  return {
    totalSightings: sightings.length,
    mostRecentDate,
    mostGhostlyCity,
  };
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 Day Ago';
    if (diffDays < 30) return `${diffDays} Days Ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} Months Ago`;
    return `${Math.floor(diffDays / 365)} Years Ago`;
  } catch {
    return dateString;
  }
}

