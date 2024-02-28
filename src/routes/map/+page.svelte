<script>
  import { derived } from "svelte/store";
  import L from "leaflet";

  import "../../app.css";
  import Leaflet from "$lib/Map/Leaflet.svelte";
  import Marker from "$lib/Map/Marker.svelte";
  import Popup from "$lib/Map/Popup.svelte";
  import PopupContent from "$lib/Map/PopupContent.svelte";
  import Sidebar from "$lib/UI/Sidebar.svelte";
  import MenuSidebar from "$lib/UI/MenuSidebar.svelte";
  import Search from "$lib/UI/Search.svelte";
  import SearchResults from "$lib/UI/SearchResults.svelte";
  import SubmissionSidebar from "$lib/UI/SubmissionSidebar.svelte";
  import menuIconPath from "$lib/icons/menu.svg";

  import {
    markersStore,
    initialViewStore,
    currentViewStore,
    mapBoundsStore,
    darkMode,
    selectedMarkerId,
    searchResultsVisible,
    submissionSidebarVisible,
  } from "$lib/stores";

  let sideBarVisible = false;
  let menuVisible = false;
  let width = 30;
  let height = 30;
  let zoomLevel = 8;
  let baseUrl =
    "https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/";

  const visibleMarkers = derived(
    [markersStore, mapBoundsStore],
    ([$markersStore, $mapBoundsStore]) => {
      if (!$mapBoundsStore || typeof $mapBoundsStore.contains !== "function") {
        return []; // Return an empty array if bounds are undefined or invalid
      }
      return $markersStore.filter((marker) => {
        // Convert the array to a LatLng object
        const [lat, lng] = marker.latLng;
        return $mapBoundsStore.contains(L.latLng(lat, lng));
      });
    }
  );

  function handleUpdateView(event) {
    const { latLng } = event.detail;
    zoomLevel = 12;
    currentViewStore.set({ lat: latLng[0], lng: latLng[1] });
  }

  function showDetails(event, markerId) {
    event.stopPropagation(); 
    sideBarVisible = true;
    selectedMarkerId.set(markerId);
  }

    // Function to handle clicks within the fullscreen div
    function handleDivClick() {
    if (sideBarVisible) {
      sideBarVisible = false;
    }
  }

  // Function to stop event propagation, to be used in the Sidebar component
  function stopPropagation(event) {
    event.stopPropagation();
  }

  function closeSubmission() {
    console.log('closing sidebar');
    submissionSidebarVisible.set(false);
  }
</script>

<h1 class={$darkMode === "dark" ? "darkmode" : ""}>*countermap</h1>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="w-full h-screen"  on:click={handleDivClick}>
  <Search on:updateView={handleUpdateView} />
  <Leaflet view={$currentViewStore} zoom={zoomLevel}>
    {#each $visibleMarkers as { latLng, visible, name, description, photos, municipality, id }, index (latLng.join(",") + "-" + index)}
      {#if visible}
        <Marker {latLng} {width} {height}>
          <Popup let:popup>
            <PopupContent
              {width}
              {height}
              {name}
              {municipality}
              {id}
              {description}
              {photos}
              {baseUrl}
              on:closeAndShowDetails={({ detail }) => {
                console.log(detail);
                showDetails(detail.event, detail.id);
                popup.close();
              }}
            />
          </Popup>
        </Marker>
      {/if}
    {/each}
  </Leaflet>
  {#if sideBarVisible}
  <Sidebar on:click={stopPropagation} />
{/if}
{#if $searchResultsVisible}
  <SearchResults results={$visibleMarkers} {baseUrl}  on:closeAndShowDetails={({ detail }) => {
    console.log(detail);
    showDetails(detail.event, detail.id);
  }}/>
{/if}
<div class='menu-button' on:click={() => menuVisible = !menuVisible}>
  <img src={menuIconPath} alt="Open Sidebar"/>
</div>
{#if menuVisible}
  <MenuSidebar on:click={stopPropagation} />
{/if}

{#if $submissionSidebarVisible}
  <SubmissionSidebar on:click={stopPropagation} on:closeSideBar={closeSubmission}/>
{/if}
</div>


<style>
  .darkmode {
    color: white;
  }
  .menu-button {
    position: absolute;
    bottom: 3.31rem;
    left: 3.75rem;
    z-index: 9999;
    border-radius: 0.25rem;
    background: #FFF;
    padding: 0.25rem;
  }
</style>
