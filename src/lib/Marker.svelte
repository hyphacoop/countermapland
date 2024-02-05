<script>
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { markersStore } from './stores';
	import L from 'leaflet';
	import customMarker from '$lib/assets/custom-marker.png'; 

	export let width;
	export let height;
	export let latLng;

	let marker;
	let mapInstance;

	const mapContext = getContext('map');

	setContext('layer', {
		// L.Marker inherits from L.Layer
		getLayer: () => marker
	});

	onMount(() => {
		mapInstance = mapContext.getMap(); 

		if (mapInstance) {
			let iconHtml = `<img src="${customMarker}" style="width: ${width}px; height: ${height}px;">`;

			let icon = L.divIcon({
				html: iconHtml,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker(latLng, { icon }).addTo(mapInstance);
		}
	});

	onDestroy(() => {
		if (marker) {
			marker.remove();
			marker = undefined;
		}
	});

	$: console.log('map', mapInstance);
</script>


{#if marker}
	<slot />
{/if}
