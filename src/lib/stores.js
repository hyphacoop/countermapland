import { writable, readable } from 'svelte/store';
import initialMarkers from '$lib/assets/markers.json';

// A writable store to manage markers and their visibility
export const markersStore = writable(initialMarkers);

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
