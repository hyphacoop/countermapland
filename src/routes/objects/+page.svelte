<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  import { writable } from "svelte/store";

  import "../../app.css";
  import { derived } from "svelte/store";
  import { markersStore, mapBoundsStore, selectedMarkerId, currentViewStore, mapInstanceStore, initialViewStore, currentSidebar } from "$lib/stores";
  import Sidebar from "$lib/UI/Sidebar.svelte";
  import SubmissionSidebar from "$lib/UI/SubmissionSidebar.svelte";
  import Search from "$lib/UI/Search.svelte";
  import Toolbar from "$lib/Map/Toolbar.svelte";
  import L, { latLngBounds } from "leaflet";

  let zoomLevel = writable(4);
  let mainElement;
  let mainWidth;

  onMount(() => {
    if (mainElement) {
      mainWidth = mainElement.offsetWidth; // Get the width of the main element
    }
    if ($mapInstanceStore) {
      return;
    }
  map = L.map('map', {
    center: [$initialViewStore[0], $initialViewStore[1]], // Set these to your desired initial view
    zoom: $zoomLevel,
    });

  mapInstanceStore.set(map); // Update the store with the initialized map instance
  map.on('zoomend', () => {
      zoomLevel.set(map.getZoom()); // Update zoomLevel based on map's current zoom
    });
});

  // Function to select a transformation pattern based on the photo index and marker index
  function getTransformation(photoIndex, index, mainWidth) {
  // Assuming each photo has a margin or padding that should be considered in the calculation
  const photoWidth = 100; // Width of each photo
  const photoHeight = 150; // Height of each photo
  const gap = 16; // Gap between photos
  
  const itemsPerRow = Math.floor(mainWidth / (photoWidth + gap)); // Calculate how many items can fit in a row based on the mainWidth

  // Calculate the marker's row and column based on its index
  const markerRow = Math.floor(index / itemsPerRow);
  const markerCol = index % itemsPerRow;

    const randomOffsetTop = Math.random() * 100;
    const randomOffsetLeft = Math.random() * 100;
    const randomDirection = Math.random() > 0.5 ? 1 : -1;
  // Additional offset for photos within the same marker
  // Adjust the positioning based on photoIndex if necessary
  const additionalLeftOffset = photoIndex * (photoWidth + gap); // This will place photos next to each other within the same marker
  // You can adjust the logic here depending on how you want to position photos relative to their marker

  const top = markerRow * (photoHeight + gap) + randomOffsetTop; // Calculate top based on the row
  const baseLeft = markerCol * (photoWidth + gap) + randomOffsetLeft; // Calculate base left position for the marker
  const left = baseLeft + additionalLeftOffset; // Adjust left position based on photoIndex within the marker

  return { top, left };
}

function getCellPosition(index, mainWidth) {
  const cellWidth = 200; // Assuming each cell is 200px wide, adjust as needed
  const gap = 16; // Gap between cells
  const itemsPerRow = Math.floor(mainWidth / (cellWidth + gap));

  const row = Math.floor(index / itemsPerRow);
  const col = index % itemsPerRow;

  const top = row * (cellWidth + gap);
  const left = col * (cellWidth + gap);

  return { top, left };
}



  function updateZoom(event) {
    const { dir } = event.detail;
    zoomLevel.update(currentZoom => {
    if (dir === 'in') {
      if (currentZoom < 4) {
      return currentZoom + 1;
      } else {
        return 3;
      } 
      return currentZoom + 1; // Increment the zoom level
    } else if (dir === 'out') {
      if (currentZoom > 2) {
      return currentZoom - 1;
      } else {
        return 4;
      } // Decrement the zoom level
    }
    return currentZoom; // Return the current value if neither 'in' nor 'out'
  });
    }

  // Derive visible and randomly selected markers
  const visibleRandomMarkers = derived(
    [markersStore, mapBoundsStore, zoomLevel],
    ([$markersStore, $mapBoundsStore, zoomLevel]) => {
      if (!$mapBoundsStore || typeof $mapBoundsStore.contains !== "function") {
        return [];
      }

      // Filter markers based on map bounds
      const visibleMarkers = $markersStore.filter((marker) => {
        const [lat, lng] = marker.latLng;
        return $mapBoundsStore.contains(L.latLng(lat, lng));
      });

      // Shuffle the array and pick the first 3 elements
      for (let i = visibleMarkers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visibleMarkers[i], visibleMarkers[j]] = [
          visibleMarkers[j],
          visibleMarkers[i],
        ]; // ES6 destructuring swap
      }

      return visibleMarkers.slice(0, zoomLevel);
    }
  );

  function calculateBoundsFromSearch(latLng, radius) {
    console.log('calculating bounds', latLng);
  
  // Convert string to float
  const lat = parseFloat(latLng[0]);
  const lng = parseFloat(latLng[1]);

  const bounds = L.latLngBounds(
    [lat - radius, lng - radius], // Southwest corner
    [lat + radius, lng + radius]  // Northeast corner
  );
  
  return bounds;
}


function calculateImageBounds(startLatLng, index, gridSpacing = 10) {
  console.log(`Calculating bounds for:`, startLatLng, `Index:`, index, `GridSpacing:`, gridSpacing);

if (!startLatLng || isNaN(startLatLng.lat) || isNaN(startLatLng.lng)) {
  console.error("Invalid startLatLng:", startLatLng);
  return null; // Return or handle error
}
  // Calculate row and column based on index
  const row = Math.floor(index / 3); // For a 3xN grid
  const col = index % 3;

  // Calculate lat and lng offsets based on row and column
  const latOffset = row * gridSpacing;
  const lngOffset = col * gridSpacing;

  // Calculate the southwest and northeast corners of the bounds
  const southWest = L.latLng(startLatLng.lat - latOffset, startLatLng.lng + lngOffset);
  const northEast = L.latLng(startLatLng.lat - latOffset - gridSpacing, startLatLng.lng + lngOffset + gridSpacing);

  return L.latLngBounds(southWest, northEast);
}

function addImageOverlay(map, imageUrl, alt, LatLng, index) {
  console.log("LatLng", LatLng, "Index", index);
  const latLngObject = { lat: LatLng[0], lng: LatLng[1] };
  const bounds = calculateImageBounds(latLngObject, index, 0.001); // Adjust gridSpacing based on your map's scale
  const overlay = L.imageOverlay(imageUrl, bounds, {alt: alt});
  overlay.addTo(map);
}

  function handleUpdateView(event) {
    console.log('updating view');
    const { latLng } = event.detail;

    const searchBounds = calculateBoundsFromSearch(latLng, 0.1);
    mapBoundsStore.set(searchBounds); 
    currentViewStore.set({ lat: latLng[0], lng: latLng[1] });
  }


  function handleImageClick(marker) {
    selectedMarkerId.set(marker.id);
  }
  function handleMainClick(event) {
    if (event.target === event.currentTarget) {
      selectedMarkerId.set(null);
      currentSidebar.set(null);
    }
  }

  $: if ($mapInstanceStore && $visibleRandomMarkers.length > 0) {
  $visibleRandomMarkers.forEach((marker, index) => {
    if (marker.photos) { 
    marker.photos.forEach(photo => {
      const imageUrl = `https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${photo.url}`;
      const latLng = [marker.latLng[0], marker.latLng[1]]; 
      addImageOverlay($mapInstanceStore, imageUrl, photo.alt, latLng, marker.id);
    });
    }
  });
}

function closeSidebar() {
    console.log('closing sidebar');
    currentSidebar.set(null);
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<main bind:this={mainElement} on:click={handleMainClick}>
  <Search on:updateView={handleUpdateView} />
  <Toolbar mapInstance={$mapInstanceStore} objectView={true} on:zoom={updateZoom} />
  <h1><a href="{base}/map">*countermap</a></h1>
  <div class="image-grid">
    {#each $visibleRandomMarkers as marker, index}
      {#if marker.photos && marker.photos.length}
        <div class="image-container" key={index}>
          {#each marker.photos as { url, alt }, photoIndex}
            <div
              class="photo-wrapper"
              style="top: {getTransformation(photoIndex, index, mainWidth)
                .top}px; left: {getTransformation(photoIndex, index, mainWidth).left}px;"
            >
              <img
                src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${url}`}
                {alt}
                key={photoIndex}
                on:click={() => handleImageClick(marker)}
              />
            </div>
          {/each}
        </div>
      {/if}
    {/each}
    <div id="map" style='display:none'></div>
  </div>
  {#if $selectedMarkerId}
    <Sidebar />
  {/if}
  {#if $currentSidebar === 'submissions'}
  <SubmissionSidebar on:closeSideBar={closeSidebar}/>
{/if}
</main>

<style>
  :global(body),
  :global(body div) {
    margin: 0;
    padding: 0;
  }
  main {
    background-color: black;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    overflow: hidden;
  }
  h1,
  a {
    color: white;
    z-index: 9999;
    font-family: "Itim", sans-serif;
    pointer-events: auto;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 100px;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: -250px;
    margin-left: -250px;
  }
  .image-container {
    position: relative;
    width: 200px;
    height: auto;
  }
  .photo-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.2 ease;
    border: 2px solid #000;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .photo-wrapper:hover {
    transform: scale(1.2);
    z-index: 5;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    max-height: 50vh;
  }
</style>
