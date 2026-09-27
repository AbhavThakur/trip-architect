import hampi from './hampi-2026.json';
import chikmagalur from './chikmagalur.json';
import vietnam from './vietnam.json';

export const STATIC_TRIPS = [
  vietnam,
  hampi,
  chikmagalur
];

export function getRegisteredTrips() {
  const custom = typeof localStorage !== 'undefined' ? localStorage.getItem('trip_architect_registry_custom') : null;
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

export function isCustomTrip(tripId) {
  return !STATIC_TRIPS.some((s) => s.id === tripId);
}

export function saveCustomTrip(trip) {
  const custom = localStorage.getItem('trip_architect_registry_custom');
  let list = [];
  if (custom) {
    try {
      list = JSON.parse(custom);
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }
  }
  // Filter out any existing trip with same ID
  list = list.filter((t) => t.id !== trip.id);
  list.unshift(trip);
  localStorage.setItem('trip_architect_registry_custom', JSON.stringify(list));
  return getRegisteredTrips();
}

export function deleteCustomTrip(tripId) {
  const custom = localStorage.getItem('trip_architect_registry_custom');
  if (custom) {
    try {
      let list = JSON.parse(custom);
      if (Array.isArray(list)) {
        list = list.filter((t) => t.id !== tripId);
        localStorage.setItem('trip_architect_registry_custom', JSON.stringify(list));
      }
    } catch (e) {
      console.error('Failed to delete custom trip', e);
    }
  }
  return getRegisteredTrips();
}

