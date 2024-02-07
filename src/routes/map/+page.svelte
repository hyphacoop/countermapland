<script>
	import '../../app.css';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';

	import { markersStore, initialViewStore } from '$lib/stores';

</script>
<h1>
    counter*map
</h1>
<div class="w-full h-screen">

    <Leaflet view={$initialViewStore} zoom={4}>
        {#each $markersStore as { latLng, visible, name, description, photos }, index (latLng.join(',') + '-' + index)}
            {#if visible}
                <Marker {latLng} width={20} height={20}>
                    <Popup>
                        <h3>
                            {name}
                        </h3>

                        {#if photos && photos.length}
                        <div class='flex flex-row overflow-x-auto'>
                                {#each photos as {url, alt}}
                                    <img src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${url}`} alt="{alt}">
                                {/each}
                            </div>
                        {/if}

                        {#if description}
                            <p class="description max-h-32 overflow-y-auto">        
                                {@html description}
                            </p>
                        {/if}

                    </Popup>
                </Marker>
            {/if}
        {/each}
    </Leaflet>
</div>

<style>
    h1 {
        font-family: 'Itim', sans-serif;
        font-size: 3rem;
        position: fixed;
        top: 1%;
        left: 50%; 
        transform: translateX(-50%);
        text-align: center;
        z-index: 9998;
        pointer-events: none; 
    }

    img {
        width: auto;
        height: 150px;
        object-fit: contain;
        margin: 5px;
    }

    p.description {
        margin-top: 2px;
    }
</style>