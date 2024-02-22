<script>
  import { markersStore } from "$lib/stores.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let searchTerm = "";

  // Computed store to filter markers based on search term
  $: filteredMarkers = $markersStore.filter((marker) =>
    marker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to dispatch an event with the latLng of the first matched marker
  function goToMarker(marker) {
    if (marker && marker.latLng) {
      dispatch("updateView", { latLng: marker.latLng });
    }
  }
</script>
<div class="search-container">
<input
  type="text"
  placeholder=" "
  bind:value={searchTerm}
  on:input={() => (searchTerm = searchTerm.trim())}
/>

{#if searchTerm}

    <ul class="results-list">
      {#each filteredMarkers as marker, index (marker.name + "-" + index)}
        <li on:click={() => goToMarker(marker)}>
          {marker.name}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search-container {
    position: fixed;
    top: 5%;
    left: 2%;
    z-index: 9999;
  }

  input {
    width: 16.625rem; /* Original width */
    height: 2.75rem;
    border-radius: 0.25rem;
    border: 0px solid #000;
    background: #FFF;
    padding-left:0.5rem;
  }

  .results-list {
    width: calc(16.625rem * 2); 
    margin-top: 1rem;
    background: #FFF; 
    position: absolute;
    left: 0;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    max-height: 300px; 
    overflow-y: auto; 
  }

  ul {
    list-style: none; 
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.5rem 0;
    cursor: pointer;
    width: auto;
  }

  li:hover {
    background: black;
    color: white;

}

</style>
