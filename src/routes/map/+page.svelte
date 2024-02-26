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
    selectedMarkerId,
  } from "$lib/stores";

  let sideBarVisible = false;
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

  function showDetails(markerId) {
        selectedMarkerId.set(markerId);
        sideBarVisible = true;
  }
</script>

<h1 class={$darkMode === "dark" ? "darkmode" : ""}>*countermap</h1>
<div class="w-full h-screen">
  <Search on:updateView={handleUpdateView} />
  <Leaflet view={$currentViewStore} zoom={8}>
    {#each $visibleMarkers as { latLng, visible, name, description, photos, municipality, id }, index (latLng.join(",") + "-" + index)}
      {#if visible}
        <Marker {latLng} width={30} height={30}>
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
            <div class='flex flex-row items-center'>
                <div class='flex flex-col'>
                    <h2>
                    {name}
                    </h2>
                    <h3>
                        {municipality}
                    </h3>
                </div>
                <div class='monument-id'>
                    #{id}
                </div>
            </div>
           
            <div class="description-container">
                {#if description}
                    <div class="text-truncate">
                        <p class="description">
                            {@html description}
                        </p>
                    </div>
              {/if}
                <div class="learn-more-container">
                  <button on:click={() => showDetails(id)} class="learn-more-button">learn more</button>     
                </div>
            </div>

          </Popup>
        </Marker>
      {/if}
    {/each}
  </Leaflet>
</div>

<style>
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

  img.main.single {
    height: 115%;
  }

  .monument-id {
    color: #000;
    font-family: "Noto Sans Mono";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
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

  .description-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 1rem;
}

.text-truncate {
    max-height: 4.5rem;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
}

.text-truncate::after {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 1.2rem;
    background: linear-gradient(to right, transparent, white 50%);
}
  p.description {
    margin-top: 0.075rem;
  }

  .learn-more-container {
    display: flex;
    justify-content: flex-end; 
    margin-top: 0.5rem; 
}
  .learn-more-button {
    background: none;
    color: black;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
}

.learn-more-button:hover,
.learn-more-button:focus {
    text-decoration: none;
}

</style>
