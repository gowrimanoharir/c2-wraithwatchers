'use client';

import { useState } from 'react';
import { Sighting } from '../types/sighting';
import { formatDate } from '../../lib/database';
import Image from 'next/image';

interface SightingsTableProps {
  sightings: Sighting[];
}

export default function SightingsTable({ sightings }: SightingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const itemsPerPage = 10;

  // Get unique tags
  const uniqueTags = Array.from(new Set(sightings.map(s => s.tag))).sort();

  // Filter sightings
  const filteredSightings = sightings.filter(sighting => {
    const matchesSearch = 
      sighting.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sighting.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sighting.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sighting.tag.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || sighting.tag === selectedTag;
    
    return matchesSearch && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSightings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSightings = filteredSightings.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="bg-black/50 border border-accent-gray/30 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by location, tag, or notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-black border border-accent-gray/30 rounded-lg text-foreground placeholder-accent-gray focus:outline-none focus:border-accent-orange"
            />
          </div>
          <div>
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-black border border-accent-gray/30 rounded-lg text-foreground focus:outline-none focus:border-accent-orange"
            >
              <option value="">All Types</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-accent-gray mt-2">
          Showing {filteredSightings.length} of {sightings.length} sightings
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-accent-gray/30 rounded-lg">
        <table className="w-full">
          <thead className="bg-black/50 border-b border-accent-gray/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-accent-gray uppercase tracking-wider">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent-gray/30">
            {currentSightings.map((sighting, index) => (
              <tr key={index} className="hover:bg-accent-gray/10 transition-colors">
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {formatDate(sighting.dateOfSighting)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {sighting.timeOfDay}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-block px-2 py-1 bg-accent-orange/20 text-accent-orange rounded text-xs font-medium">
                    {sighting.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {sighting.city}, {sighting.state}
                </td>
                <td className="px-4 py-3 text-sm text-accent-gray max-w-xs truncate">
                  {sighting.notes}
                </td>
                <td className="px-4 py-3 text-sm">
                  {sighting.imageLink ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={sighting.imageLink}
                        alt={sighting.tag}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="text-accent-gray text-xs">No image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-black border border-accent-gray/30 rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gray/20 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-accent-gray">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-black border border-accent-gray/30 rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gray/20 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

