<script>
  import { derived } from "svelte/store";
  import { onMount } from "svelte";
  import L from "leaflet";

  import "../../app.css";
  import Leaflet from "$lib/Map/Leaflet.svelte";
  import Marker from "$lib/Map/Marker.svelte";
  import Popup from "$lib/Map/Popup.svelte";

  import Search from "$lib/UI/Search.svelte";

  import {
    markersStore,
    initialViewStore,
    currentViewStore,
    mapBoundsStore,
    darkMode,
  } from "$lib/stores";

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
    currentViewStore.set({ lat: latLng[0], lng: latLng[1] });
  }
</script>

<h1 class={$darkMode === "dark" ? "darkmode" : ""}>*countermap</h1>
<div class="w-full h-screen">
  <Search on:updateView={handleUpdateView} />
  <Leaflet view={$currentViewStore} zoom={8}>
    {#each $visibleMarkers as { latLng, visible, name, description, photos }, index (latLng.join(",") + "-" + index)}
      {#if visible}
        <Marker {latLng} width={20} height={20}>
          <Popup>
            {#if photos && photos.length}
              <div class="image-container">
                {#if photos && photos.length === 1}
                  <img
                    src={`${baseUrl}${photos[0].url}`}
                    alt={photos[0].alt}
                    class="main single"
                  />
                {:else if photos.length === 2}
                  <img
                    src={`${baseUrl}${photos[0].url}`}
                    alt={photos[0].alt}
                    class="centered-left"
                  />
                  <img
                    src={`${baseUrl}${photos[1].url}`}
                    alt={photos[1].alt}
                    class="centered-right"
                  />
                {:else if photos.length >= 3}
                  <img
                    src={`${baseUrl}${photos[1].url}`}
                    alt={photos[1].alt}
                    class="side left"
                  />
                  <img
                    src={`${baseUrl}${photos[0].url}`}
                    alt={photos[0].alt}
                    class="main"
                  />
                  <img
                    src={`${baseUrl}${photos[2].url}`}
                    alt={photos[2].alt}
                    class="side right"
                  />
                {/if}
              </div>
            {/if}
            <h2>
              {name}
            </h2>
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
    font-family: "Itim", sans-serif;
    font-size: 3rem;
    position: fixed;
    top: 1%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 9998;
    pointer-events: none;
  }

  h2 {
    margin-top: 1rem;
    color: #000;
    font-family: Itim;
    font-size: 2.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .darkmode {
    color: white;
  }

  img {
    width: auto;
    height: 100px;
    object-fit: contain;
    margin: 5px;
    border: 0.075rem solid #000;
  }

  .image-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    perspective: 100rem;
    margin: 1.25rem 0rem;
    height: 100px;
  }

  .image-container img.main {
    z-index: 2;
    transition: transform 0.3s ease;
    position: relative;
  }

  .image-container img.side {
    height: 90px;
    position: absolute;
    transition: transform 0.3s ease;
    z-index: 1;
  }

  .image-container img.left {
    left: 0%;
    top: 15%;
    transform: rotateZ(5deg);
  }

  .image-container img.right {
    right: 0%;
    top: 15%;
    transform: rotateZ(-5deg);
  }

  .image-container img.centered-left {
    transform: translateX(10%) rotateZ(5deg); /* Adjust the percentage as needed */
    z-index: 1;
  }

  .image-container img.centered-right {
    transform: translateX(-10%) rotateZ(-5deg); /* Adjust the percentage as needed */
    z-index: 1;
  }

  p.description {
    margin-top: 2px;
  }
</style>
