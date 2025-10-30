export interface Sighting {
  dateOfSighting: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeOfDay: string;
  tag: string;
  imageLink: string;
}

export interface SightingStats {
  totalSightings: number;
  mostRecentDate: string;
  mostGhostlyCity: string;
}

