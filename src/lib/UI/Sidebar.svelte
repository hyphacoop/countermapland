<script>
  import { fly } from "svelte/transition";

  import { selectedMarkerId, markersStore } from "$lib/stores";
  import { writable, derived } from "svelte/store";
  
  import { fetchTerritoryByPosition } from "$lib/Map/utilities";

  import monumentSvg from '$lib/icons/monument.svg';

  import ImageArray from "./ImageArray.svelte";

  export let width, height;

  let baseUrl =
    "https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/";

  const selectedMarker = derived(
    [selectedMarkerId, markersStore],
    ([$selectedMarkerId, $markersStore]) =>
      $markersStore.find((marker) => marker.id === $selectedMarkerId)
  );

  // Local variable to store territory names
  let territories = writable("");

  // Fetch territory information whenever the selected marker changes
  $: if ($selectedMarker && $selectedMarker.latLng) {
    fetchTerritoryByPosition($selectedMarker.latLng[0], $selectedMarker.latLng[1]).then(data => {
        if (data && data.length > 0) {
            // Determine the correct word to use based on the number of territories
            const territoryWord = data.length > 1 ? 'territories' : 'territory';
            
            // Extracting the Name from each item's properties and joining them with a comma
            territories.set(`${data.map(item => item.properties.Name).join(", ")} ${territoryWord}`);
        } else {
            territories.set("No territory information available.");
        }
    }).catch(error => {
        console.error("Failed to fetch territory information", error);
        territories.set("Failed to fetch territory information.");
    });
  }
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
  {#if $selectedMarker}
    <div class="marker">
      {#if $selectedMarker.photos && $selectedMarker.photos.length}
        <ImageArray photos={$selectedMarker.photos} {baseUrl} />
      {/if}
      <div class="flex flex-col items-start">
        <div class="monument-id">#{$selectedMarker.id}</div>
        <div class="flex flex-row items-center">
          <div class="flex flex-col items-start">
            <h2>{$selectedMarker.name}</h2>
            <h3>{$selectedMarker.municipality}</h3>
            <h4>{$territories ? $territories : `Loading territories...` }</h4>
          </div>
          <div style="width: {width}px; height: {height}px;">
            <img src="{monumentSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
          </div>
        </div>
      </div>
      <div class='latLong'>
        {$selectedMarker.latLng[0]}, {$selectedMarker.latLng[1]}
      </div>
      {#if $selectedMarker.description}
        <div class="description-container">
          {@html $selectedMarker.description}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .sidebar {
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9999;
    padding: 0 1.88rem;
  }
  .latLong {
    margin: 1rem 0;
    color: #666565;
    font-family: "BCSans";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
</style>
