<script>
  import { fly } from "svelte/transition";

  import { selectedMarkerId, markersStore } from "$lib/stores";
  import { writable, derived } from "svelte/store";

  import {
    fetchTerritoryByPosition,
    fetchClosestAddress,
  } from "$lib/Map/utilities";

  import monumentSvg from "$lib/icons/monument.svg";

  import ImageArray from "./ImageArray.svelte";

  let baseUrl =
    "https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/";

  const selectedMarker = derived(
    [selectedMarkerId, markersStore],
    ([$selectedMarkerId, $markersStore]) =>
      $markersStore.find((marker) => marker.id === $selectedMarkerId)
  );

  // Local variable to store territory names
  let territories = writable("");

  let closestAddress = "";

  // Fetch territory information whenever the selected marker changes
  $: if ($selectedMarker && $selectedMarker.latLng) {
    // Indicate that territories are being loaded
    territories.set("Loading territories...");

    fetchTerritoryByPosition(
      $selectedMarker.latLng[0],
      $selectedMarker.latLng[1]
    )
      .then((data) => {
        if (data && data.length > 0) {
          // Extract just the territory names
          const names = data.map((item) => item.properties.Name);

          // Determine the correct word to use based on the number of territories
          const territoryWord = names.length > 1 ? "territories" : "territory";

          // Format the names with 'and' before the last name if there are multiple territories
          let formattedNames = "";
          if (names.length > 1) {
            const allButLast = names.slice(0, -1).join(", ");
            const last = names[names.length - 1];
            formattedNames = `${allButLast} and ${last}`;
          } else {
            formattedNames = names[0];
          }

          territories.set(`${formattedNames} ${territoryWord}`);
        } else {
          territories.set("No territory information available.");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch territory information", error);
        territories.set("Failed to fetch territory information.");
      });

    // Fetch and display the closest address
    fetchClosestAddress($selectedMarker.latLng[0], $selectedMarker.latLng[1])
      .then((address) => {
        closestAddress = address;
      })
      .catch((error) => {
        console.error("Failed to fetch closest address", error);
        closestAddress = "Failed to fetch address.";
      });
  }

  $: hasPhotos =
    $selectedMarker &&
    $selectedMarker.photos &&
    $selectedMarker.photos.length > 0;
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
        <div class="monument-id" class:mt-6={!hasPhotos}>
          #{$selectedMarker.id}
        </div>
        <div class="flex flex-row items-baseline w-full justify-between">
          <h2>{$selectedMarker.name}</h2>
          <div class="image-container">
            <img src={monumentSvg} alt="Monument Marker" />
          </div>
        </div>

        <!-- Flex container for municipality and territories -->
        <div class="flex flex-col items-start data-container">
          <h3>{$selectedMarker.municipality}</h3>
          <h4>{$territories}</h4>
        </div>
      </div>

      <div class="addressAndLatLong">
        <div>
          {closestAddress}
        </div>
        <div>
          {$selectedMarker.latLng[0]}, {$selectedMarker.latLng[1]}
        </div>
      </div>
      {#if $selectedMarker.description}
        <div class="description-container">
          {@html $selectedMarker.description}
        </div>
      {/if}
      {#if $selectedMarker.maintainer}
        <div class="maintainer-container">
          <p class='label-header'>
            Maintainer
          </p>
          <p class='label'>
            {$selectedMarker.maintainer}
          </p>
        </div>
      {/if}
      {#if $selectedMarker.location}
      <div class="maintainer-container">
        <p class='label-header'>
          Location
        </p>
        <p class='label'>
          {$selectedMarker.location}
        </p>
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
  .addressAndLatLong {
    margin: 1rem 0;
    color: #666565;
    font-family: "BCSans";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .image-container {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: start;
  }

  .image-container img {
    max-width: 100%;
    max-height: 100%;
  }

  .label {
    width: fit-content;
    border-radius: 0.25rem;
    padding: 0.125rem 0.625rem;
    border: 1px solid #000;
    color: #000;
    font-family: "BCSans";
    font-size: 0.6875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin: 0.25rem 0;
  }

  .label-header {
    color: #000;
    font-family: "BCSans";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
</style>
