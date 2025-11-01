'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { addSighting } from '../../lib/database';

// Dynamically import map component
const MapPicker = dynamic(() => import('../components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-black border border-accent-gray/30 rounded-lg flex items-center justify-center">
      <p className="text-accent-gray">Loading map...</p>
    </div>
  ),
});

interface FormData {
  date: string;
  time: string;
  type: string;
  notes: string;
  latitude: number;
  longitude: number;
}

export default function PostSighting() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: '',
    notes: '',
    latitude: 39.8283,
    longitude: -98.5795,
  });

  const apparitionTypes = [
    'Shadow Figure',
    'White Lady',
    'Poltergeist',
    'Orbs',
    'Phantom Sounds',
    'Headless Spirit',
    'Apparition',
    'Other',
  ];

  const timesOfDay = [
    'Dawn',
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
    'Midnight',
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Save to Supabase database
      const result = await addSighting({
        dateOfSighting: formData.date,
        timeOfDay: formData.time,
        tag: formData.type,
        notes: formData.notes,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: 'Unknown', // Could add reverse geocoding later
        state: 'Unknown',
      });

      if (result.success) {
        // Navigate to thank you page
        router.push('/thank-you');
      } else {
        // Show rate limit or error message
        let errorMsg = result.error || 'Failed to submit sighting';
        
        // Add retry time if rate limited
        if (result.resetAt) {
          const resetTime = new Date(result.resetAt).toLocaleTimeString();
          errorMsg = `Rate limit exceeded. Too many submissions. Try again after ${resetTime}.`;
        }
        
        setError(errorMsg);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting sighting:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Post a <span className="text-accent-orange">Sighting</span>
        </h1>
        <p className="text-accent-gray max-w-2xl mx-auto">
          Did you spot a spirit? Post information below so that our community can stand vigilant!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date of Sighting */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Date of Sighting
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 bg-black border border-accent-gray/30 rounded-lg text-foreground focus:outline-none focus:border-accent-orange"
          />
        </div>

        {/* Time of Sighting */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-2">
            Time of Sighting
          </label>
          <select
            id="time"
            required
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-4 py-3 bg-black border border-accent-gray/30 rounded-lg text-foreground focus:outline-none focus:border-accent-orange"
          >
            <option value="">Select time of day...</option>
            {timesOfDay.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* Type of Sighting */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Type of Sighting
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-3 bg-black border border-accent-gray/30 rounded-lg text-foreground focus:outline-none focus:border-accent-orange"
          >
            <option value="">Select apparition type...</option>
            {apparitionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Sighting Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Sighting Notes
          </label>
          <textarea
            id="notes"
            required
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Describe what you witnessed..."
            className="w-full px-4 py-3 bg-black border border-accent-gray/30 rounded-lg text-foreground placeholder-accent-gray focus:outline-none focus:border-accent-orange resize-none"
          />
        </div>

        {/* Location Picker */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Where Were You Exactly? (Place a Pin)
          </label>
          <p className="text-xs text-accent-gray mb-3">
            Click on the map to mark the exact location of your sighting
          </p>
          <MapPicker 
            onLocationSelect={handleLocationSelect}
            initialPosition={[formData.latitude, formData.longitude]}
          />
          <p className="text-xs text-accent-gray mt-2">
            Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-accent-orange text-black rounded-lg font-bold text-lg hover:bg-accent-orange/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting Sighting...' : 'Post Your Sighting'}
        </button>
      </form>
    </div>
  );
}

