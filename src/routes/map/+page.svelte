<script>
	import '../../app.css';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';

	import { markersStore, initialViewStore } from '$lib/stores';

</script>

<div class="w-full h-screen">
    <Leaflet view={$initialViewStore} zoom={12}>
        {#each $markersStore as { latLng, visible, popupContent }, index (latLng.join(',') + '-' + index)}
            {#if visible}
                <Marker {latLng} width={20} height={20}>
                    <Popup>{popupContent}</Popup>
                </Marker>
            {/if}
        {/each}
    </Leaflet>
</div>