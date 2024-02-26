<script>
    import '../../app.css';
    import { derived } from 'svelte/store';
    import { markersStore, mapBoundsStore, selectedMarkerId } from '$lib/stores'; 
    import Sidebar from '$lib/UI/Sidebar.svelte';

    const transformPatterns = [
        (photoIndex, index) => `translate(${(index * 100) + (photoIndex * 50)}px, ${(photoIndex * 70)}px)`, // Right-Down, double the index translation
        (photoIndex, index) => `translate(${-(index * 100) + (photoIndex * 50)}px, ${(photoIndex * 80)}px)`, // Left-Down
        (photoIndex, index) => `translate(${(index * 100) + (photoIndex * 50)}px, ${-(photoIndex * 50)}px)`, // Right-Up
        (photoIndex, index) => `translate(${-(index * 100) + (photoIndex * 50)}px, ${-(photoIndex * 50)}px)`, // Left-Up
    ];

    // Function to select a transformation pattern based on the photo index and marker index
    function getTransformation(photoIndex, index) {
        // Use both photoIndex and index to select a pattern
        const patternIndex = (photoIndex + index) % transformPatterns.length;
        return transformPatterns[patternIndex](photoIndex, index); // Pass both indices to the pattern function
    }

    // Derive visible and randomly selected markers
    const visibleRandomMarkers = derived([markersStore, mapBoundsStore], ([$markersStore, $mapBoundsStore]) => {
        if (!$mapBoundsStore || typeof $mapBoundsStore.contains !== 'function') {
            return [];
        }

        // Filter markers based on map bounds
        const visibleMarkers = $markersStore.filter(marker => {
            const [lat, lng] = marker.latLng;
            return $mapBoundsStore.contains(L.latLng(lat, lng));
        });

        // Shuffle the array and pick the first 3 elements
        for (let i = visibleMarkers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [visibleMarkers[i], visibleMarkers[j]] = [visibleMarkers[j], visibleMarkers[i]]; // ES6 destructuring swap
        }

        return visibleMarkers.slice(0, 4);
    });

    function handleImageClick(marker) {
        selectedMarkerId.set(marker.id); 
        console.log('selectedObject', selectedObject); 
    }
    function handleMainClick(event) {
        if (event.target === event.currentTarget) {
            selectedMarkerId.set(null);
        }
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={handleMainClick}>
    <h1>
        *countermap
    </h1>
    <div class="image-grid">
        {#each $visibleRandomMarkers as marker, index}
            {#if marker.photos && marker.photos.length}
                <div class="image-container" key={index}>
                    {#each marker.photos as {url, alt}, photoIndex}
                        <div class="photo-wrapper" style="transform: {getTransformation(photoIndex, index)};">
                            <img src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${url}`} alt={alt} key={photoIndex}  on:click={() => handleImageClick(marker)}>
                        </div>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
    {#if $selectedMarkerId}
        <Sidebar />
    {/if}

</main>

<style>
    :global(body), :global(body div) {
        margin: 0;
        padding: 0;
    }
    main {
        background-color: black;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        width:auto;
        overflow: hidden;
    }
    h1 {
        color: white;
    }

    .image-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 0 100px;
        justify-content: center;
        align-items: center;
        margin-left: -350px;
    }
    .image-container {
        position: relative;
        width: 200px;
        height: 200px;
    }
    .photo-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        transition: transform 0.2s ease;
        border: 2px solid #000; 
    }
    .photo-wrapper:hover {
        transform: scale(1.1);
        z-index: 1;
    }
    img {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
        max-height: 50vh;
    }
</style>
