<script>
  import { fly } from "svelte/transition";

  import { selectedMarkerId, markersStore, searchResultsActive, currentSidebar } from "$lib/stores";
  import { writable, derived } from "svelte/store";

  import {
    fetchTerritoryByPosition,
    fetchClosestAddress,
  } from "$lib/Map/utilities";

  import monumentSvg from "$lib/icons/monument.svg";
  import countermonumentSvg from "$lib/icons/countermonument.svg";
  import closeImage from "$lib/icons/close.svg";

  import inscriptions from "$lib/assets/inscriptions.json";

  import ImageArray from "./ImageArray.svelte";

  let baseUrl =
    "https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/";

  const selectedMarker = derived(
    [selectedMarkerId, markersStore],
    ([$selectedMarkerId, $markersStore]) =>
      $markersStore.find((marker) => marker.id === $selectedMarkerId)
  );

  let territories = writable("");
  let selectedInscription = null;
  let preparedPhotos = [];
  let closestAddress = "";
  let svgToUse;

  $: {
    const inscriptionItem = inscriptions.find(item => item.id === $selectedMarkerId);
    selectedInscription = inscriptionItem ? inscriptionItem.inscription : null;
  }

  $: if ($selectedMarker) {
      svgToUse = $selectedMarker.challengesPower ? countermonumentSvg : monumentSvg;
  }

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

  function closingSidebar() {
    selectedMarkerId.set(null);
    if ($searchResultsActive) {
      currentSidebar.set("search");
      searchResultsActive.set(false);
    }
  }


 $: {
    if ($selectedMarker) {
      let photos = [];

      // Use the existing photos array if it exists
      if ($selectedMarker.photos && $selectedMarker.photos.length) {
        photos = [...$selectedMarker.photos];
      }

      // Check for photo_link and add it to the photos array
      if ($selectedMarker.photo_link) {
        photos.push({
          url: $selectedMarker.photo_link,
          alt: "Photo 1" // Provide a meaningful alt text or derive it as needed
        });
      }

      // Check for photo_link_2 and add it to the photos array
      if ($selectedMarker.photo_link_2) {
        photos.push({
          url: $selectedMarker.photo_link_2,
          alt: "Photo 2" // Provide a meaningful alt text or derive it as needed
        });
      }

      preparedPhotos = photos;
    }
  }

  // Now, hasPhotos checks if preparedPhotos has items
  $: hasPhotos = preparedPhotos.length > 0;
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
<button class="close-button" on:click={closingSidebar} >
  <img src={closeImage} alt="Close Sidebar"/>
</button>
  {#if $selectedMarker}
    <div class="marker">
      {#if hasPhotos}
        <ImageArray photos={preparedPhotos} baseUrl={$selectedMarker.challengesPower ? '' : baseUrl} />
      {/if}
      <div class="flex flex-col items-start mt-6">
        <div class="monument-id" class:mt-6={!hasPhotos}>
          #{$selectedMarker.id}
        </div>
        <div class="flex flex-row items-baseline w-full justify-between">
          <h2>{$selectedMarker.name}</h2>
          <div class="image-container">
            <img src={svgToUse} alt="Monument Marker" />
          </div>
        </div>

        <!-- Flex container for municipality and territories -->
        <div class="flex flex-col items-start data-container">
          <h3>{$territories}</h3>
          {#if $selectedMarker.municipality && $selectedMarker.municipality !== 'null' && $selectedMarker.municipality !== 'undefined'}
          <h4>{$selectedMarker.municipality}</h4>
          {/if}
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

        {#if selectedInscription}
        <div class="inscription-container">
          <p>Inscription #01</p>
          <p>
            {@html selectedInscription}
          </p>
        </div>
      {/if}
      <div class='metadata'>
        {#if $selectedMarker.maintainer}
          <div>
            <p class='label-header'>
              Maintainer
            </p>
            <p class='label'>
              {$selectedMarker.maintainer}
            </p>
          </div>
        {/if}
        {#if $selectedMarker.location}
        <div>
          <p class='label-header'>
            Location
          </p>
          <p class='label'>
            {$selectedMarker.location}
          </p>
        </div>
      {/if}
      {#if $selectedMarker.type}
      <div>
        <p class='label-header'>
          Object
        </p>
        <p class='label'>
          {$selectedMarker.type}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.organization}
      <div>
        <p class='label-header'>
          Organization
        </p>
        <p class='label'>
          {$selectedMarker.organization}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.use_type}
      <div>
        <p class='label-header'>
          Use Type
        </p>
        <p class='label'>
          {$selectedMarker.use_type}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.object_type}
      <div>
        <p class='label-header'>
          Object Type
        </p>
        <p class='label'>
          {$selectedMarker.object_type}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.year_dedicated}
      <div>
        <p class='label-header'>
          Year Dedicated
        </p>
        <p class='label'>
          {$selectedMarker.year_dedicated}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.year_removed}
      <div>
        <p class='label-header'>
          Year Removed
        </p>
        <p class='label'>
          {$selectedMarker.year_removed}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.honorees_1}
      <div>
        <p class='label-header'>
          Honorees 1
        </p>
        <p class='label'>
          {$selectedMarker.honorees_1}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.honorees_2}
      <div>
        <p class='label-header'>
          Honorees 2
        </p>
        <p class='label'>
          {$selectedMarker.honorees_2}
        </p>
      </div>
      {/if}
      {#if $selectedMarker.data_link}
      <div>
        <p class='label-header'>
          Data
        </p>
        <p class='label'>
          <a href="{$selectedMarker.data_link}" target="_blank">Link</a>
        </p>
      </div>
      {/if}
    </div>
  </div>
  {/if}
  {#if $selectedMarker?.challengesPower === false}
  <p class='disclaimer'>
    <i>
      This information is imported from third-party datasets and does not reflect the opinions of countermap.
    </i>
  </p>
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
    padding-top: 2.69rem;
    min-height:100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    align-items: flex-start;
  }

  .image-container img {
    max-width: 20px;
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
  .inscription-container {
    margin: 1rem 0rem;
    color: #000;
    font-family: "BC Sans";
    font-size: 0.6875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 0.25rem;
    background: #FFD966; 
    border: 1px solid #000;
    padding: 1.19rem 1rem;
  }
  .inscription-container p:first-child {
    margin-bottom: 1.19rem;
  }
  .metadata {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-bottom: 1.56rem;
  }
  .metadata div {
    margin-right: 0.5rem;
  }
  p.disclaimer {
    margin-top:5rem;
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      padding: 0 1.88rem;
      padding-top: 1.69rem;
    }
  }
</style>
