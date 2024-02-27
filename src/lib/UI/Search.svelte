<script>
  import { createEventDispatcher } from "svelte";

  import { searchResultsVisible } from "$lib/stores";

  const dispatch = createEventDispatcher();
  let city = "";
  let searchResults = [];
  let isLoading = false;
  let errorMessage = "";

  async function findLocation() {
    if (!city) return;
    isLoading = true;
    errorMessage = "";
    searchResults = []; // Clear previous results
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      city
    )}&format=json&limit=10`; // Currently set at 10 results

    try {
      const response = await fetch(url);
      const data = await response.json();
      isLoading = false;
      if (data.length > 0) {
        searchResults = data; // Store the search results
      } else {
        errorMessage = "Location not found";
      }
    } catch (error) {
      isLoading = false;
      errorMessage = "Error fetching location";
    }
  }

  function selectLocation(lat, lon) {
    city = "";
    searchResults = [];
    updateMap(lat, lon);
    searchResultsVisible.set(true);
}

function updateMap(latitude, longitude) {
  const locationData = [ latitude, longitude ];
  console.log('locationData', locationData);
  dispatch('updateView', { latLng: locationData });
}
</script>
<div class="search-container">
    <input
      type="text"
      bind:value={city}
      on:input={() => (city = city.trim())}
      on:keydown={(event) => { if (event.key === 'Enter') findLocation() }}
    />
    
    {#if isLoading}
    <div class="results-list">
      <p>Loading...</p>
    </div>
    {:else if searchResults.length > 0}
    <ul class="results-list">
      {#each searchResults as result}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li on:click={() => selectLocation(result.lat, result.lon)}>{result.display_name}</li>
      {/each}
    </ul>
    {:else if errorMessage}
    <div class="results-list">
      <p>{errorMessage}</p>
    </div>
    {/if}
    </div>
    
<style>
  .search-container {
    position: fixed;
    top: 3.75rem;
    left: 4.25rem;
    z-index: 9999;
  }

  input {
    width: 12.625rem; 
    height: 2.75rem;
    border-radius: 0.25rem;
    border: 0px solid #000;
    background: #fff;
    padding-left: 0.5rem;
  }

  .results-list {
    width: calc(16.625rem * 2);
    margin-top: 1rem;
    background: #fff;
    position: absolute;
    left: 0;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
