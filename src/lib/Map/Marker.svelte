<script>
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { darkMode } from '../stores';
	import L from 'leaflet';
	import customMarker from '$lib/assets/custom-marker.png'; 
	import customMarkerWhite from '$lib/assets/custom-marker-white-outline.png';

	export let width;
	export let height;
	export let latLng;

	let marker;
	let mapInstance;
	const mapContext = getContext('map');

setContext('layer', {
	getLayer: () => marker
});

// Function to create and update marker
function createOrUpdateMarker(mode) {
	const iconUrl = mode === 'dark' ? customMarkerWhite : customMarker;
	let iconHtml = `<img src="${iconUrl}" style="width: ${width}px; height: ${height}px;">`;

	let icon = L.divIcon({
		html: iconHtml,
		className: 'map-marker',
		iconSize: L.point(width, height)
	});

	if (marker) {
		marker.setIcon(icon);
	} else if (mapInstance) {
		marker = L.marker(latLng, { icon }).addTo(mapInstance);
	}
}

onMount(() => {
	mapInstance = mapContext.getMap();
	darkMode.subscribe(mode => { // Correctly subscribe to darkMode
            createOrUpdateMarker(mode);
        });
});

onDestroy(() => {
	if (marker) {
		marker.remove();
		marker = undefined;
	}
});
</script>

{#if marker}
<slot />
{/if}