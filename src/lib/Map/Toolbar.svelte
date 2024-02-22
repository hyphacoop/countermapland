<script>
  import {
    isMarkersVisible,
    setMapStyleIndex,
    toggleDarkMode,
    toggleTerritoriesVisibility,
  } from "$lib/stores";

  import Peephole from "$lib/UI/Peephole.svelte";

  export let mapInstance;

  // SVG Icons
  import plusIconPath from "$lib/icons/plus.svg";
  import minusIconPath from "$lib/icons/minus.svg";
  import layersIconPath from "$lib/icons/layers.svg";
  import counterMonumentIconPath from "$lib/icons/countermonument.svg";
  import monumentIconPath from "$lib/icons/monument.svg";

  // Peephoke image
  import basicMapImage from "$lib/icons/peephole/map-basic.png";

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
</script>

<div class="flex flex-col toolbar-container">
  <button class="rounded">
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
  <button id='peephole'
    on:click={() => (showPeephole = !showPeephole)}
    title="Select Map Style"
  >
    <img src={basicMapImage} alt="Select Map Style" />
  </button>
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
	align-items: center;
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
	margin-bottom:3rem;
}
	#peephole {
		width: 5rem;
		height: 4rem;
		border-radius: 50%;;
	}
	#peephole img {
		border-radius: 50%;
		padding: 0.5rem;
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
  }

  button:hover {
    opacity: 100%;
    background-color: lightgray;
  }
</style>
