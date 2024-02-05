<script>
	import '../../app.css';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';

	import { markersStore, initialViewStore } from '$lib/stores';

	console.log('hello')


</script>

<div class="w-full h-screen">
    <Leaflet view={$initialViewStore} zoom={12}>
        {#each $markersStore as { latLng, visible, popupContent } (latLng.join(','))}
		{console.log(latLng)}
            {#if visible}
                <Marker {latLng} width={40} height={40}>
                    <Popup>{popupContent}</Popup>
                </Marker>
            {/if}
        {/each}
    </Leaflet>
</div>