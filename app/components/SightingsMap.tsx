'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Sighting } from '../types/sighting';
import { formatDate } from '../../lib/database';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Fix Leaflet default marker icon issue in Next.js
const createGhostIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="8" fill="#FF9F40" opacity="0.8"/>
        <circle cx="16" cy="16" r="4" fill="#F8F8F8"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface SightingsMapProps {
  sightings: Sighting[];
}

function MapUpdater({ sightings }: { sightings: Sighting[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (sightings.length > 0) {
      const bounds = sightings.map(s => [s.latitude, s.longitude] as LatLngExpression);
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [sightings, map]);
  
  return null;
}

export default function SightingsMap({ sightings }: SightingsMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-black border border-accent-gray/30 rounded-lg flex items-center justify-center">
        <p className="text-accent-gray">Loading map...</p>
      </div>
    );
  }

  const center: LatLngExpression = [39.8283, -98.5795]; // Center of US

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-accent-gray/30">
      <MapContainer
        center={center}
        zoom={4}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater sightings={sightings} />
        {sightings.map((sighting, index) => (
          <Marker
            key={index}
            position={[sighting.latitude, sighting.longitude]}
            icon={createGhostIcon()}
          >
            <Popup className="ghost-popup" maxWidth={300}>
              <div className="p-2 bg-black text-foreground">
                <h3 className="font-bold text-accent-orange mb-2">{sighting.tag}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Date:</strong> {formatDate(sighting.dateOfSighting)}</p>
                  <p><strong>Time:</strong> {sighting.timeOfDay}</p>
                  <p><strong>Location:</strong> {sighting.city}, {sighting.state}</p>
                  <p className="text-xs text-accent-gray mt-2">{sighting.notes}</p>
                  {sighting.imageLink && (
                    <div className="mt-2 relative w-full h-40">
                      <Image
                        src={sighting.imageLink}
                        alt={`${sighting.tag} sighting`}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

