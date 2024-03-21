<script>
  import { derived } from "svelte/store";
  import L from "leaflet";

  import { fade } from "svelte/transition";

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
  import Banner from "$lib/UI/Banner.svelte";

  import menuIconPath from "$lib/icons/menu.svg";
  import filterIconPath from "$lib/icons/filter.svg";

  import { populatePhotos } from "$lib/Map/utilities";

  import {
    markersStore,
    filteredStore,
    currentViewStore,
    mapBoundsStore,
    darkMode,
    selectedMarkerId,
    currentSidebar,
    isPopupOpen,
    bannerClosed,
  } from "$lib/stores";

  import ToolsSidebar from "$lib/UI/ToolsSidebar.svelte";

  let width = 25;
  let height = 25;
  let zoomLevel = 10;
  let baseUrl =
    "https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/";

 // visibleMarkers to consider both map bounds and filtering
 const visibleMarkers = derived(
  [markersStore, mapBoundsStore, currentSidebar, filteredStore],
  ([$markersStore, $mapBoundsStore, $currentSidebar, $filteredStore]) => {
    if ($currentSidebar === 'tools' && $filteredStore.length > 0) {
      // When filtering is active, use filteredStore directly
      return $filteredStore;
    } else {
      // When not filtering, apply bounds to determine visibility
      return $markersStore.filter(marker => {
        const [lat, lng] = marker.latLng;
        return $mapBoundsStore.contains(L.latLng(lat, lng));
      });
    }
  }
);

  function handleUpdateView(event) {
    console.log('updating view');
    const { latLng } = event.detail;
    zoomLevel = 12;
    currentViewStore.set({ lat: latLng[0], lng: latLng[1] });
    currentSidebar.set('search');
  }

  function showDetails(event, markerId) {
    console.log('showing details');
    if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }
    setCurrentSidebar('sidebar');
    selectedMarkerId.set(markerId);
  }
  function handleDivClick(event) {
    if ($currentSidebar !== 'search' && $currentSidebar !== 'submissions' && $currentSidebar !== 'tools') {
      if (!event.target.closest('.sdbbtn') && !event.target.closest('.sidebar')) {
          setCurrentSidebar(null);
          selectedMarkerId.set(null);
      }
    }
  }

  function setCurrentSidebar(sidebar) {
    currentSidebar.set(sidebar);
  }

  function closeSidebar() {
    console.log('closing sidebar');
    setCurrentSidebar(null);
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



  $: console.log($currentSidebar);

  $: populatedMarkers = $visibleMarkers.map(marker => ({
    ...marker,
    photos: populatePhotos(marker)
  }));
</script>
{#if $isPopupOpen === false}
  <h1 
    in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}
    class={$darkMode === "dark" ? "darkmode" : ""}
  >
    *countermap
  </h1>
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="w-full h-screen"  on:click={handleDivClick}>
  <Search on:updateView={handleUpdateView} />
  <Leaflet view={$currentViewStore} zoom={zoomLevel}>
    {#each populatedMarkers as { latLng, visible, name, description, photos, municipality, id, challengesPower }, index (latLng.join(",") + "-" + index)}
      {#if visible}
        <Marker {latLng} {width} {height} {challengesPower}>
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
              {challengesPower}
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


<button class='menu-button sdbbtn' on:click={showMenu}>
  <img src={menuIconPath} alt="Open Menu Sidebar"/>
</button>
<button class='filter-button sdbbtn' on:click={showTools}>
  <img src={filterIconPath} alt="Open Filter Sidebar"/>
</button>

{#if $selectedMarkerId !== null && $currentSidebar === 'sidebar'}
<Sidebar />
{/if}

{#if $currentSidebar === 'menu'}
  <MenuSidebar />
{/if}

{#if $currentSidebar === 'submissions'}
  <SubmissionSidebar on:closeSideBar={closeSidebar}/>
{/if}

{#if $currentSidebar === 'tools'}
  <ToolsSidebar />
{/if}

{#if $currentSidebar === 'search'}
  <SearchResults results={$visibleMarkers} {baseUrl}  on:closeAndShowDetails={({ detail }) => {
    console.log(detail);
    showDetails(detail.event, detail.id);
  }}/>
{/if}
{#if $bannerClosed === false}
  <div class='banner-container'>
    <Banner on:openSubmissions={openSubmissions}/>
  </div>
{/if}
</div>


<style>
  .darkmode {
    color: white;
    text-shadow: 1px 1px 1px rgb(0, 0, 0);
  }
  .banner-container {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 10%;
  }
  @media (max-width: 768px) {
    h1 {
      display: none;
    }
  }
</style>
