<script>
  import { base } from "$app/paths";

  import "../../app.css";
  import { derived } from "svelte/store";
  import { markersStore, mapBoundsStore, selectedMarkerId } from "$lib/stores";
  import Sidebar from "$lib/UI/Sidebar.svelte";

  // Function to select a transformation pattern based on the photo index and marker index
  function getTransformation(photoIndex, index) {
    const randomOffsetTop = Math.random() * 10;
    const randomOffsetLeft = Math.random() * 50;
    const randomDirection = Math.random() > 0.5 ? 1 : -1;
    // Calculate top and left based on photoIndex and index
    const top = photoIndex * 150 + randomOffsetTop;
    const left =
      index * 100 + (photoIndex * 50 + randomOffsetLeft) * randomDirection;
    return { top, left };
  }

  // Derive visible and randomly selected markers
  const visibleRandomMarkers = derived(
    [markersStore, mapBoundsStore],
    ([$markersStore, $mapBoundsStore]) => {
      if (!$mapBoundsStore || typeof $mapBoundsStore.contains !== "function") {
        return [];
      }

      // Filter markers based on map bounds
      const visibleMarkers = $markersStore.filter((marker) => {
        const [lat, lng] = marker.latLng;
        return $mapBoundsStore.contains(L.latLng(lat, lng));
      });

      // Shuffle the array and pick the first 3 elements
      for (let i = visibleMarkers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visibleMarkers[i], visibleMarkers[j]] = [
          visibleMarkers[j],
          visibleMarkers[i],
        ]; // ES6 destructuring swap
      }

      return visibleMarkers.slice(0, 4);
    }
  );

  function handleImageClick(marker) {
    selectedMarkerId.set(marker.id);
    console.log("selectedObject", selectedObject);
  }
  function handleMainClick(event) {
    if (event.target === event.currentTarget) {
      selectedMarkerId.set(null);
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={handleMainClick}>
  <h1><a href="{base}/map">*countermap</a></h1>
  <div class="image-grid">
    {#each $visibleRandomMarkers as marker, index}
      {#if marker.photos && marker.photos.length}
        <div class="image-container" key={index}>
          {#each marker.photos as { url, alt }, photoIndex}
            <div
              class="photo-wrapper"
              style="top: {getTransformation(photoIndex, index)
                .top}px; left: {getTransformation(photoIndex, index).left}px;"
            >
              <img
                src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${url}`}
                {alt}
                key={photoIndex}
                on:click={() => handleImageClick(marker)}
              />
            </div>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
  {#if $selectedMarkerId}
    <Sidebar />
  {/if}
</main>

<style>
  :global(body),
  :global(body div) {
    margin: 0;
    padding: 0;
  }
  main {
    background-color: black;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    overflow: hidden;
  }
  h1,
  a {
    color: white;
    z-index: 9999;
    font-family: "Itim", sans-serif;
    pointer-events: auto;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 100px;
    justify-content: center;
    align-items: center;
    margin-top: -250px;
    margin-left: -250px;
  }
  .image-container {
    position: relative;
    width: 200px;
    height: auto;
  }
  .photo-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.2 ease;
    border: 2px solid #000;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .photo-wrapper:hover {
    transform: scale(1.2);
    z-index: 5;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    max-height: 50vh;
  }
</style>
