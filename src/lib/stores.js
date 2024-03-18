import { writable, readable, derived } from 'svelte/store';
import initialMarkers from '$lib/assets/markers.json';
import counterMarkers from '$lib/assets/counterMarkers.json';
import L from 'leaflet';
import { MaptilerStyle } from '@maptiler/leaflet-maptilersdk';

// Merge all markers
const allMarkers = initialMarkers.concat(counterMarkers);

// Writable stores to manage different element's visibility
export const markersStore = writable(allMarkers);
export const filteredStore = writable([]);
export const territoriesVisible = writable(false);

const initialBounds = L.latLngBounds(
  L.latLng(-90, -180), // SouthWest
  L.latLng(90, 180)    // NorthEast
);

// Store to keep track of current map bounds
export const mapBoundsStore = writable(initialBounds);

const mapStyles = [    
  { id: L.MaptilerStyle.SATELLITE, name: 'Satellite' },
  { id: L.MaptilerStyle.BASIC, name: 'Basic' },
  { id: L.MaptilerStyle.OCEAN, name: 'Ocean' },
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
export const darkMode = writable('dark');

// Store to manage the cluster group
export const clusterGroupStore = writable(null);

// Function to select the map styles
export function setMapStyleIndex(index) {
  if (index < mapStyles.length) {
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

//// Function to get the current view from local storage
function getCurrentViewFromStorage() {
  // Attempt to retrieve and parse the stored view
  const storedView = localStorage.getItem('currentView');
  if (!storedView) return null;
  
  // Check if the stored view is in a latitude,longitude format
  if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(storedView)) {
    // It's a lat,long string; split and convert to numbers
    const [lat, lng] = storedView.split(',').map(Number);
    return lat, lng;
  } else {
    // Attempt JSON parsing for other formats
    try {
      return JSON.parse(storedView);
    } catch (e) {
      console.error('Error parsing stored view:', e.message);
      return null;
    }
  }
}

// Function to save the current view to local storage
function saveCurrentViewToStorage(view) {
  localStorage.setItem('currentView', JSON.stringify(view));
}

// Function to select a random marker's latLng
function getRandomInitialView(markers) {
  const randomIndex = Math.floor(Math.random() * markers.length);
  return markers[randomIndex].latLng;
}

const initialView = getRandomInitialView(initialMarkers);

// Initialize initialViewStore with a random latLng from markers
export const initialViewStore = writable(initialView);

// Attempt to get the current view from local storage
const savedCurrentView = getCurrentViewFromStorage();

// Initialize currentViewStore with either the saved current view or the initial view
export const currentViewStore = writable(savedCurrentView || initialView);

// Subscribe to changes in currentViewStore to save them for future sessions
currentViewStore.subscribe((currentView) => {
  saveCurrentViewToStorage(currentView);
});

// Add a writable store for the current selected marker
export const selectedMarkerId = writable(null);

// Store for the current sidebar
export const currentSidebar = writable(null);
// Current menu Section
export const currentMenuSection = writable("Menu");

// Derived store to manage the visibility of the markers
export const isMarkersVisible = derived(currentSidebar, $currentSidebar => $currentSidebar !== 'submissions');

// and keep track if search results are active
export const searchResultsActive = writable(false);
// or keep track if filters are active
export const filtersActive = writable(false);

// Store user's latitude and longitude for submissions
export const userLatLng = writable(null);

export const mapInstanceStore = writable(null);

// keep track of formData
export const formData = writable({
  names: [{ id: "name1", value: "" }],
  altText: "",
  description: "",
  dynamicFieldValues: {},
  consentGiven: false,
  powerDominanceAnswer: null,
  success: false,
  submitting: false,
  errorMessage: false,
  email: "",
  files: null,
  file: null,
  activeInfoButtons: {},
  serverResponds: false,
  imageUrl: null,
});

export const isPopupOpen = writable(false);

// Generic function to create a writable store that synchronizes with localStorage
function createPersistedStore(key, startValue) {
  const storedValue = localStorage.getItem(key);
  const initialValue = storedValue ? JSON.parse(storedValue) : startValue;
  
  const store = writable(initialValue, () => {
    const unsubscribe = store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return unsubscribe;
  });

  return store;
}

// Use this function to create your persistable stores
export const bannerClosed = createPersistedStore('bannerClosed', false);