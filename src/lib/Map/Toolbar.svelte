<script>
  import { base } from "$app/paths";

  import {
    isMarkersVisible,
    setMapStyleIndex,
    toggleDarkMode,
    toggleTerritoriesVisibility,
    currentMapStyleIndex,
    currentSidebar,
  } from "$lib/stores";

  import Peephole from "$lib/UI/Peephole.svelte";

  // Import the images for each map style
  import territoriesImage from "$lib/icons/peephole/map-territories.png";
  import streetsImage from "$lib/icons/peephole/map-streets.png";
  import satelliteImage from "$lib/icons/peephole/map-satellite.png";

  import objectImage from "$lib/icons/peephole/object-view.png";

  // SVG Icons
  import plusIconPath from "$lib/icons/plus.svg";
  import minusIconPath from "$lib/icons/minus.svg";
  import layersIconPath from "$lib/icons/layers.svg";
  import counterMonumentIconPath from "$lib/icons/countermonument.svg";
  import monumentIconPath from "$lib/icons/monument.svg";

  export let mapInstance;

  let eye = true;
  let darkIcon = true;
  let showPeephole = false;

  // Function to handle zoom in
  function zoomIn() {
    console.log("zooming in");
    if (mapInstance) {
      mapInstance.zoomIn();
    } else {
      console.error("Map instance is not available.");
    }
  }

  // Function to handle zoom out
  function zoomOut() {
    mapInstance.zoomOut();
  }

  function clickEye() {
    eye = !eye;
    isMarkersVisible.update((v) => !v);
  }

  function toggleMarkerColor() {
    toggleDarkMode();
    darkIcon = !darkIcon;
  }
  function toggleTerritoriesLayer() {
    toggleTerritoriesVisibility();
  }

  // Function to handle map style selection from Peephole
  function handleMapStyleSelect(styleIndex) {
    setMapStyleIndex(styleIndex);
    showPeephole = false;
  }

  function openSubmissions() {
    currentSidebar.set("submissions");
  }

  let currentImage = satelliteImage; // Default image, change as needed
  $: {
    switch ($currentMapStyleIndex) {
      case 0:
        currentImage = satelliteImage;
        break;
      case 1:
        currentImage = streetsImage;
        break;
      case 2:
        currentImage = territoriesImage;
        break;
      // Add more cases as needed for additional styles
      default:
        currentImage = satelliteImage; // Default case, can adjust as needed
    }
  }
</script>

<div class="flex flex-col toolbar-container" on:click|stopPropagation>
  <div class='mr-5'>
    <button class="rounded sdbbtn" on:click|stopPropagation={openSubmissions}>
      <img src={counterMonumentIconPath} alt="Submit" />
    </button>
    <div class="zoom-container">
      <button on:click={zoomIn}>
        <img src={plusIconPath} alt="Zoom in" />
      </button>
      <button on:click={zoomOut}>
        <img src={minusIconPath} alt="Zoom out" />
      </button>
    </div>
  </div>

  <!-- Hiding dev buttons for now 
  <div class='devButtons'>
  <button on:click={toggleTerritoriesLayer}>🗺️</button>
  <button type="button" on:click={clickEye} title="Show Markers">
    <svg
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={eye ? 2 : 1}
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {#if eye}
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        ></path>
      {:else}
        <path
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        ></path>
      {/if}
    </svg>
  </button>

  <button on:click={toggleMarkerColor}>
    <img src={monumentIconPath} alt="Toggle" />
  </button>
</div>
-->
  <div class="peephole-container flex flex-row-reverse items-center">
    <button
      id="peephole"
      class="mb-2"
      on:click={() => (showPeephole = !showPeephole)}
      title="Select Map Style"
    >
      <img src={currentImage} alt="Select Map Style" />
    </button>
    {#if showPeephole}
      <a href="{base}/objects" class="link-button" title="Object View">
        <img src={objectImage} alt="Object View" />
      </a>
    {/if}
  </div>
  {#if showPeephole}
    <Peephole onMapStyleSelect={handleMapStyleSelect} />
  {/if}
</div>

<style>
  .rounded {
    border-radius: 50%;
    padding: 0.5rem;
    margin-bottom: 2rem;
  }
  div.toolbar-container {
    position: fixed;
    top: 5%;
    z-index: 9999;
    right: 2%;
    align-items: end;
  }
  div.zoom-container {
    margin-bottom: 2rem;
  }
  .zoom-container button {
    border-radius: 0;
  }
  .zoom-container button:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .zoom-container button:last-child {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  .devButtons {
    margin-bottom: 3rem;
  }
  #peephole,
  .link-button {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    padding: 0.25rem;
    transition: all 0.3s ease;
  }
  #peephole:hover,
  .link-button:hover {
    transform: scale(1.1);
  }
  .link-button {
  position: relative;
  overflow: hidden; 
  margin-right: 0.5rem;
}
  #peephole img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .link-button img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 150%;
    object-fit: cover;
    border-radius: 50%;
  }
  button {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    background: #fff;
    transition-property: background-color, background-opacity;
    transition-duration: 250ms;
    margin-right: 5px;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.10); 
    border: 0.25px solid #D9D9D9; 
  }

  button:hover:not(#peephole) {
    opacity: 100%;
    background-color: lightgray;
  }
</style>
