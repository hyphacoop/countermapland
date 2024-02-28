import { writable, readable, derived } from 'svelte/store';
import initialMarkers from '$lib/assets/markers.json';
import L from 'leaflet';
import { MaptilerStyle } from '@maptiler/leaflet-maptilersdk';

// Writable stores to manage different element's visibility
export const markersStore = writable(initialMarkers);
export const territoriesVisible = writable(true);

const initialBounds = L.latLngBounds(
  L.latLng(-90, -180), // SouthWest
  L.latLng(90, 180)    // NorthEast
);

// Store to keep track of current map bounds
export const mapBoundsStore = writable(initialBounds);

const mapStyles = [    
  { id: L.MaptilerStyle.SATELITTE, name: 'Satelitte' },
  { id: L.MaptilerStyle.OCEAN, name: 'Ocean' },
  { id: L.MaptilerStyle.BASIC, name: 'Basic' },
];
  
export default mapStyles; 

// Initial map styles array (used before mapStyles default settings; waiting to be removed)
const mapStylesasMapLayers = [
    { id: 'ea23fd9e-d558-4144-8524-437d953095b1', name: 'Land (simple)' },
    { id: '1a4fbfcb-8545-4168-b618-2fcf10732f13', name: 'OpenMap Outline' },
  ];

// Store to manage the current style index
export const currentMapStyleIndex = writable(0);

// Setting 'light' as the default mode
export const darkMode = writable('light');

// Store to manage the cluster group
export const clusterGroupStore = writable(null);

// Function to select the map styles
export function setMapStyleIndex(index) {
  if (index >= 0 && index < mapStyles.length) {
    currentMapStyleIndex.set(index);
    console.log("Map style index set to:", index)
  } else {
    console.error("Invalid map style index:", index);
  }
}

// Function to toggle dark mode
export function toggleDarkMode() {
  darkMode.update(mode => mode === 'dark' ? 'light' : 'dark');
}

// Function to toggle territories visibility
export function toggleTerritoriesVisibility() {
  // Update the territoriesVisible store with the opposite value
  territoriesVisible.update(n => !n);
}

// Helper function to get the current map style ID
export const currentMapStyleId = derived(
  currentMapStyleIndex,
  $index => mapStyles[$index].id
  );

// Initial view coordinates
const initialView = [49.06193, -81.02026]; // Center of North America

export const initialViewStore = writable(initialView);

// Current view store, starts as initial view
export const currentViewStore = writable(initialView);

// Store to manage the visibility of the markers
export const isMarkersVisible = writable(true);

// Add a writable store for the current selected marker
export const selectedMarkerId = writable(null);

// Store for search result visibility
export const searchResultsVisible = writable(false);

// Store for submission sidebar visibility
export const submissionSidebarVisible = writable(false);