import { writable, readable, derived } from 'svelte/store';
import initialMarkers from '$lib/assets/markers.json';

// A writable store to manage markers and their visibility
export const markersStore = writable(initialMarkers);

const mapStyles = [
    { id: L.MaptilerStyle.DATAVIZ, name: 'Data Visualization' },
    { id: L.MaptilerStyle.SATELLITE, name: 'Satellite' },
    { id: L.MaptilerStyle.STREETS, name: 'Streets' },
    { id: L.MaptilerStyle.STREETS.DARK, name: 'Streets Dark' },
    { id: L.MaptilerStyle.HYBRID, name: 'Hybrid' },
    { id: L.MaptilerStyle.OUTDOOR, name: 'Outdoor' },
    { id: L.MaptilerStyle.BASIC, name: 'Basic' },
    { id: L.MaptilerStyle.BRIGHT, name: 'Bright' },
    { id: L.MaptilerStyle.TOPO, name: 'Topographic' },
    { id: L.MaptilerStyle.VOYAGER, name: 'Voyager' },
    { id: L.MaptilerStyle.TONER, name: 'Toner' },
    { id: L.MaptilerStyle.OPENSTREETMAP, name: 'OpenStreetMap' },
    { id: L.MaptilerStyle.OCEAN, name: 'Ocean' },
  ];
  
export default mapStyles;
  

// Initial map styles array
const mapStylesasMapLayers = [
    { id: 'ea23fd9e-d558-4144-8524-437d953095b1', name: 'Land (simple)' },
    { id: '1a4fbfcb-8545-4168-b618-2fcf10732f13', name: 'OpenMap Outline' },
  ];

// Store to manage the current style index
export const currentMapStyleIndex = writable(0);
// Store to manage the current language
export const currentLanguage = writable('FRENCH');

// Function to cycle through the map styles
export function cycleMapStyle() {
    console.log('Cycling map style');
  currentMapStyleIndex.update(index => (index + 1) % mapStyles.length);
}

// Function to cycle through the languages
export function switchLanguage() {
  currentLanguage.update(language => {
    return language === 'FRENCH' ? 'ENGLISH' : 'FRENCH';
  });
}

// Helper function to get the current map style ID
export const currentMapStyleId = derived(
  currentMapStyleIndex,
  $index => mapStyles[$index].id
  );

// Initial view coordinates
const initialView = [43.6483296,-79.3932053]; // Toronto for now

export const initialViewStore = readable(initialView);

// Function to toggle marker visibility
export function toggleMarkerVisibility(visible) {
    markersStore.update(markers => {
        // Toggle each marker object 'visible' property
        // Updated logic here might depend on final data structure
        markers.forEach(marker => marker.visible = visible);
        return markers;
    });
}
