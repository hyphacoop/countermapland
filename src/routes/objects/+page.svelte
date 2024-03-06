<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";

  import "../../app.css";
  import { derived } from "svelte/store";
  import { markersStore, mapBoundsStore, selectedMarkerId, currentViewStore, mapInstanceStore, initialViewStore, currentSidebar } from "$lib/stores";
  import Sidebar from "$lib/UI/Sidebar.svelte";
  import SubmissionSidebar from "$lib/UI/SubmissionSidebar.svelte";
  import Search from "$lib/UI/Search.svelte";
  import Toolbar from "$lib/Map/Toolbar.svelte";
  import MenuSidebar from "$lib/UI/MenuSidebar.svelte";
  import ToolsSidebar from "$lib/UI/ToolsSidebar.svelte";
  
  import L, { latLngBounds } from "leaflet";

  import menuIconPath from "$lib/icons/menu.svg";
  import filterIconPath from "$lib/icons/filter.svg";
  

  let zoomLevel = writable(8);
  let mainElement;
  let mainWidth;

  onMount(() => {
    if (mainElement) {
      mainWidth = mainElement.offsetWidth; 
    }
    if ($mapInstanceStore) {
      return;
    }
  let onMountview;
  if ($currentViewStore) {
    console.log('current view store', $currentViewStore);

    onMountview = $initialViewStore
  } else {
    onMountview = $initialViewStore
  }
  map = L.map('map', {
    center: [onMountview[0], onMountview[1]], // Set these to your desired initial view
    zoom: $zoomLevel,
    });

  mapInstanceStore.set(map); // Update the store with the initialized map instance
  map.on('zoomend', () => {
      zoomLevel.set(map.getZoom()); // Update zoomLevel based on map's current zoom
    });
});

  // Function to select a transformation pattern based on the photo index and marker index
  function getTransformation(indexI, mainWidth) {

  const index = indexI % 3;
  // Assuming each photo has a margin or padding that should be considered in the calculation
  const photoWidth = 75; // Width of each photo
  const photoHeight = 50; // Height of each photo
  const gap = 4; // Gap between photos
  
 
    const randomOffsetTop = Math.random() * 75;
    const randomOffsetLeft = Math.random() * 75;
    const randomDirection = Math.random() > 0.5 ? 1 : -1;

    const itemsPerRow = Math.floor(mainWidth / (photoWidth + gap + randomOffsetLeft)); // Calculate how many items can fit in a row based on the mainWidth

// Calculate the marker's row and column based on its index
const markerRow = Math.floor(index / itemsPerRow);
const markerCol = index % itemsPerRow;


  const additionalLeftOffset = index * (photoWidth + gap); // This will place photos next to each other within the same marker
  // You can adjust the logic here depending on how you want to position photos relative to their marker

  const top = markerRow * (photoHeight + gap) + (randomOffsetTop * randomDirection); // Calculate top based on the row
  const baseLeft = markerCol * (photoWidth + gap) + (randomOffsetLeft * randomDirection); // Calculate base left position for the marker
  const left = baseLeft + additionalLeftOffset; // Adjust left position based on photoIndex within the marker

  return { top, left };
}


  function updateZoom(event) {
    const { dir } = event.detail;
    zoomLevel.update(currentZoom => {
    if (dir === 'in') {
      if (currentZoom < 16) {
      return currentZoom + 1;
      } else {
        return 3;
      } 
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

      // Shuffle the array and pick the first X elements
      for (let i = visibleMarkers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visibleMarkers[i], visibleMarkers[j]] = [
          visibleMarkers[j],
          visibleMarkers[i],
        ]; 
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
    console.log('main click');
    if (!event.target.closest('.sdbbtn') && !event.target.closest('.sidebar')) {
          currentSidebar.set(null);
          selectedMarkerId.set(null);
      }
  }

  function setCurrentSidebar(sidebar) {
    currentSidebar.set(sidebar);
  }

  
  function showMenu() {
    if ($currentSidebar === 'menu') {
      setCurrentSidebar(null);
    } else {
      setCurrentSidebar('menu');
    }
  }

  function showTools() {
    if ($currentSidebar === 'tools') {
      setCurrentSidebar(null);
    } else {
      setCurrentSidebar('tools');
    }
  }

  function openSubmissions() {
    setCurrentSidebar('submissions');
  }

function closeSidebar() {
    console.log('closing sidebar');
    currentSidebar.set(null);
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<main bind:this={mainElement} on:click={handleMainClick}>
  <div class="content-container">
  <Search on:updateView={handleUpdateView} />
  <Toolbar mapInstance={$mapInstanceStore} objectView={true} on:zoom={updateZoom} />
  <h1><a href="{base}/map">*countermap</a></h1>
  <div class="image-grid">
    {#each $visibleRandomMarkers as marker, index}
    {#if marker.photos && marker.photos.length > 0}
      <div class="image-container" key={index} style="top: {getTransformation(index, mainWidth).top}px; left: {getTransformation(index, mainWidth).left}px;">
        <img
          on:click|stopPropagation
          src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${marker.photos[0].url}`}
          alt={marker.photos[0].alt}
          on:click={() => handleImageClick(marker)}
          in:fade={{ duration: 300 }}
          out:fade={{ duration: 300 }}
          style="cursor: pointer;"
        />
      </div>
    {/if}
  {/each}

  
    <div id="map" style='display:none'></div>
  </div>
  {#if $selectedMarkerId}
    <Sidebar />
  {/if}
  {#if $currentSidebar === 'submissions'}
  <SubmissionSidebar on:closeSideBar={closeSidebar} objectView={true}/>
{/if}

{#if $currentSidebar === 'menu'}
  <MenuSidebar />
{/if}

{#if $currentSidebar === 'tools'}
  <ToolsSidebar />
{/if}
</div>

<div class='buttons-container'>
<button class='menu-button sdbbtn' on:click={showMenu}>
  <img src={menuIconPath} alt="Open Menu Sidebar"/>
</button>
<button class='filter-button sdbbtn' on:click={showTools}>
  <img src={filterIconPath} alt="Open Filter Sidebar"/>
</button>
</div>
{#if !$bannerClosed}
  <div class='banner-container'>
    <Banner on:openSubmissions={openSubmissions}/>
  </div>
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
  }
  .content-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  h1 {
    text-shadow: 1px 1px 1px rgb(0, 0, 0);
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
  }
  .image-container {
    position: relative;
    width: 150px;
    height: auto;
    transition: all 0.3s ease;
  }
  .image-container:hover {
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
  .buttons-container {
  position: fixed; /* or absolute, depending on need */
  bottom: 0;
  right: 0;
  z-index: 10; /* Ensure it's above other content if overlapping */
}
</style>
