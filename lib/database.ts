import { supabase } from './supabase';
import { Sighting, SightingStats } from '../app/types/sighting';

export async function fetchSightings(): Promise<Sighting[]> {
  if (!supabase) {
    console.warn('Supabase client not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('sightings')
    .select('*')
    .order('date_of_sighting', { ascending: false });

  if (error) {
    console.error('Error fetching sightings:', error);
    throw error;
  }

  // Transform database format to app format
  return (data || []).map((row: any) => ({
    dateOfSighting: row.date_of_sighting,
    latitude: row.latitude,
    longitude: row.longitude,
    city: row.city,
    state: row.state,
    notes: row.notes,
    timeOfDay: row.time_of_day,
    tag: row.tag,
    imageLink: row.image_link,
  }));
}

export async function addSighting(sighting: {
  dateOfSighting: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeOfDay: string;
  tag: string;
  imageLink?: string;
}): Promise<{ success: boolean; error?: string; resetAt?: string }> {
  // Use API route for rate limiting
  try {
    const response = await fetch('/api/sightings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sighting),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || data.error || 'Failed to submit sighting',
        resetAt: data.resetAt
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding sighting:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function calculateStats(sightings: Sighting[]): SightingStats {
  if (sightings.length === 0) {
    return {
      totalSightings: 0,
      mostRecentDate: 'N/A',
      mostGhostlyCity: 'N/A',
    };
  }

  const mostRecentDate = sightings[0]?.dateOfSighting || 'N/A';

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

