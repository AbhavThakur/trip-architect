import chikmagalur from './chikmagalur.json';
import vietnam from './vietnam.json';

export const STATIC_TRIPS = [
  chikmagalur,
  vietnam
];

export function getRegisteredTrips() {
  const custom = localStorage.getItem('trip_architect_registry_custom');
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed)) {
        // Exclude any custom trips that have the same ID as official static trips
        const filtered = parsed.filter(c => !STATIC_TRIPS.some(s => s.id === c.id));
        return [...STATIC_TRIPS, ...filtered];
      }
    } catch (e) {
      console.error('Failed to parse custom trips', e);
    }
  }
  return STATIC_TRIPS;
}
