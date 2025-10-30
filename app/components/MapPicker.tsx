'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const createPinIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 5C14.477 5 10 9.477 10 15C10 22.5 20 35 20 35C20 35 30 22.5 30 15C30 9.477 25.523 5 20 5Z" fill="#FF9F40" stroke="#000000" stroke-width="2"/>
        <circle cx="20" cy="15" r="4" fill="#000000"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition: [number, number];
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={createPinIcon()} />
  );
}

export default function MapPicker({ onLocationSelect, initialPosition }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-black border border-accent-gray/30 rounded-lg flex items-center justify-center">
        <p className="text-accent-gray">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-accent-gray/30">
      <MapContainer
        center={initialPosition}
        zoom={4}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}

