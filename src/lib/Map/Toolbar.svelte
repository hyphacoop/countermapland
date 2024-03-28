<script>
  import { createEventDispatcher } from "svelte";	
  import { base } from "$app/paths";

  import {
    setMapStyleIndex,
    currentSidebar,
  } from "$lib/stores";

  import Peephole from "$lib/UI/Peephole.svelte";

  import objectImage from "$lib/icons/objects.svg";
  import landImage from "$lib/icons/land.svg";

  // SVG Icons
  import plusIconPath from "$lib/icons/plus.svg";
  import minusIconPath from "$lib/icons/minus.svg";
  import pinImg from '$lib/icons/pin.svg';


  export let mapInstance;
  export let objectView = false;

  let showPeephole = false;

  const dispatch = createEventDispatcher();

  // Function to handle zoom in
  function zoomIn() {
    if (objectView) {
      dispatch('zoom', { dir: 'in' })
    } else {
      console.log("zooming in");
      if (mapInstance) {
        mapInstance.zoomIn();
      } else {
        console.error("Map instance is not available.");
      }
    }
  }

  // Function to handle zoom out
  function zoomOut() {
    if (objectView) {
      dispatch('zoom', { dir: 'out' })
    } else {
      console.log("zooming out");
      if (mapInstance) {
        mapInstance.zoomOut();
      } else {
        console.error("Map instance is not available.");
      }
    }
  }

  // Function to handle map style selection from Peephole
  function handleMapStyleSelect(styleIndex) {
    setMapStyleIndex(styleIndex);
    showPeephole = false;
  }

  function openSubmissions() {
    if ($currentSidebar === "submissions") {
      currentSidebar.set(null);
    } else
    currentSidebar.set("submissions");
  }

  let currentImage = landImage; // Default image, change as needed
  
</script>

<div class="flex flex-col toolbar-container" on:click|stopPropagation>
  <div>
    <button class="rounded sdbbtn mb-8" on:click|stopPropagation={openSubmissions}>
      <img class='pinImg' src={pinImg} alt="Submit" />
    </button>
    <div class="zoom-container">
      <button on:click={zoomIn}>
        <img src={plusIconPath} alt="Zoom in" class='max-w' />
      </button>
      <button on:click={zoomOut}>
        <img src={minusIconPath} alt="Zoom out" class='max-w'/>
      </button>
    </div>
  </div>

  <div class="peephole-container flex flex-row-reverse items-center">
    <button
      id="peephole"
      class="white-bg rounded"
      on:click={() => (showPeephole = !showPeephole)}
      title="Select Map Style"
    >
      <img src={!objectView ? currentImage : objectImage} alt="Select Map Style" />
    </button>
    {#if showPeephole}
      <a href={`${base}/${objectView ? 'map' : 'objects'}`} class="link-button rounded white-bg" title="Object View">
        <img class="img-size" src={!objectView ? objectImage : currentImage} alt="Object View"  />
      </a>
    {/if}
  </div>
  {#if showPeephole && !objectView}
    <Peephole onMapStyleSelect={handleMapStyleSelect} />
  {/if}
</div>

<style>
  .white-bg {
    background-color:#fff;
    padding: 1rem;
  }
  .rounded {
    border-radius: 50%;
    padding: 0.5rem;
  }
  div.toolbar-container {
    position: fixed;
    top: 5%;
    z-index: 9999;
    right: 2%;
    align-items: end;
  }
  .zoom-container {
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
  #peephole,
  .link-button {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    padding: 0.25rem;
    transition: all 0.3s ease;
  }
  #peephole:hover,
  .link-button:hover {
    transform: scale(1.25);
  }
  .link-button {
  position: relative;
  overflow: hidden; 
  margin-right: 1.5rem;
}
  #peephole img, .img-size {
    width: 70%;
    height: 70%;
    object-fit: cover;
  }

  .link-button img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    border-radius: 50%;
  }
  button {
    width: 3.75rem;
    height: 3.75rem;
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
  button img {
    width: 50%;
    height: 50%;
  }
  button img.pinImg {
    width: 75%;
    height: 75%;
  }

  button:hover:not(#peephole) {
    opacity: 100%;
    background-color: lightgray;
  }

  .max-w {
    max-width: 22px;
  }

  @media (max-width: 768px) {
    div.toolbar-container {
      top: 2.5%;
    }
    button {
      width: 2.75rem;
      height: 2.75rem;
    }
    #peephole,
    .link-button {
      width: 2.75rem;
      height: 2.75rem;
    }
    .link-button {
      margin-right: 1rem;
    }
    .zoom-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .zoom-container {
      margin-bottom: 1rem;
    }
    .zoom-container button {
      width: 2.75rem;
      height: 2.75rem;
    }
    .zoom-container button img {
      width:40%;
      height: 40%;
    }
  }
</style>
