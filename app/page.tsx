'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Sighting, SightingStats } from './types/sighting';
import { fetchSightings, calculateStats, getRelativeTime } from '../lib/database';
import SightingsTable from './components/SightingsTable';

// Dynamically import map component (client-side only)
const SightingsMap = dynamic(() => import('./components/SightingsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-black border border-accent-gray/30 rounded-lg flex items-center justify-center">
      <p className="text-accent-gray">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [stats, setStats] = useState<SightingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSightings();
        setSightings(data);
        setStats(calculateStats(data));
      } catch (error) {
        console.error('Error loading sightings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <p className="text-accent-gray">Loading sightings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Sightings <span className="text-accent-orange">Map</span>
        </h1>
        <p className="text-accent-gray max-w-2xl mx-auto">
          Explore documented ghost sightings across the United States. 
          Click markers for details and images.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-black border border-accent-gray/30 rounded-lg p-6 text-center hover:border-accent-orange/50 transition-colors">
            <div className="text-3xl sm:text-4xl font-bold text-accent-orange mb-2">
              {stats.totalSightings.toLocaleString()}
            </div>
            <div className="text-sm text-accent-gray uppercase tracking-wide">
              Total Sightings
            </div>
          </div>
          
          <div className="bg-black border border-accent-gray/30 rounded-lg p-6 text-center hover:border-accent-orange/50 transition-colors">
            <div className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {getRelativeTime(stats.mostRecentDate)}
            </div>
            <div className="text-sm text-accent-gray uppercase tracking-wide">
              Most Recent Sighting
            </div>
          </div>
          
          <div className="bg-black border border-accent-gray/30 rounded-lg p-6 text-center hover:border-accent-orange/50 transition-colors">
            <div className="text-lg sm:text-xl font-bold text-foreground mb-2">
              {stats.mostGhostlyCity}
            </div>
            <div className="text-sm text-accent-gray uppercase tracking-wide">
              Most Ghostly City
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Sightings Map</h2>
        </div>
        <SightingsMap sightings={sightings} />
      </div>

      {/* Filter Control Panel */}
      <div className="bg-black/50 border border-accent-gray/30 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Filter Control Panel</h2>
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-4 py-2 bg-accent-orange text-black rounded-lg font-medium hover:bg-accent-orange/80 transition-colors"
          >
            {showTable ? 'Hide Table' : 'Show Table'}
          </button>
        </div>
      </div>

      {/* Sightings Table */}
      {showTable && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sightings Table</h2>
            <button
              onClick={() => {
                const csvContent = 'data:text/csv;charset=utf-8,' + 
                  encodeURIComponent(
                    'Date,Time,Type,City,State,Notes,Image\n' +
                    sightings.map(s => 
                      `"${s.dateOfSighting}","${s.timeOfDay}","${s.tag}","${s.city}","${s.state}","${s.notes}","${s.imageLink}"`
                    ).join('\n')
                  );
                const link = document.createElement('a');
                link.setAttribute('href', csvContent);
                link.setAttribute('download', 'ghost_sightings.csv');
                link.click();
              }}
              className="px-4 py-2 bg-black border border-accent-gray/30 rounded-lg text-sm font-medium hover:bg-accent-gray/20 transition-colors"
            >
              Export Data
            </button>
          </div>
          <SightingsTable sightings={sightings} />
        </div>
      )}
    </div>
  );
}
