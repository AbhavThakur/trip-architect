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
        return [...STATIC_TRIPS, ...parsed];
      }
    } catch (e) {
      console.error('Failed to parse custom trips', e);
    }
  }
  return STATIC_TRIPS;
}
