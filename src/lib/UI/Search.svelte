<script>
  import { createEventDispatcher, onMount } from "svelte";

  import { currentSidebar, searchResultsActive } from "$lib/stores";

  import pinImg from '$lib/icons/pin.svg';

  const dispatch = createEventDispatcher();
  let city = "";
  let searchResults = [];
  let isLoading = false;
  let errorMessage = "";
  let placeholderText = '';

  onMount(() => {
    const updatePlaceholder = () => {
      placeholderText = window.innerWidth < 768 ? "Search *countermap" : "";
    };

    // Call once on mount
    updatePlaceholder();

    // Add event listener to update on resize
    window.addEventListener('resize', updatePlaceholder);

    // Cleanup on component destruction
    return () => window.removeEventListener('resize', updatePlaceholder);
  });

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
    currentSidebar.set("search");
    searchResultsActive.set(true);
}

function updateMap(latitude, longitude) {
  const locationData = [ latitude, longitude ];
  console.log('locationData', locationData);
  dispatch('updateView', { latLng: locationData });
}
</script>
<div class="search-container sdbbtn">
  <div class="input-wrapper">
    <img src={pinImg} alt="Pin" class="pin-icon"/>
    <input
      type="text"
      bind:value={city}
      on:input="{($event) => city = $event.target.value}"
      on:keydown={(event) => { if (event.key === 'Enter') findLocation() }}
      placeholder={placeholderText}
    />
  </div>
    {#if isLoading}
    <div class="results-list">
      <p>Loading...</p>
    </div>
    {:else if searchResults.length > 0}
    <ul class="results-list sdbbtn">
      {#each searchResults as result}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li on:click={(event) => {event.stopPropagation(); selectLocation(result.lat, result.lon);}}>{result.display_name}</li>
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
    top: 4.9%;
    left: 3.75rem;
    z-index: 9999;
  }

  input {
    width: 12.625rem; 
    height: 2.75rem;
    border-radius: 0.25rem;
    border: 0px solid #000;
    background: #fff;
    padding-left: 0.5rem;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.10); 
    border: 0.25px solid #D9D9D9; 
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

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .pin-icon {
    display: none;
  }
  @media (max-width: 768px) {
    .search-container {
      left: 1.88rem;
    }
    input {
      padding-left: 2rem;
    }
    input::placeholder {
      font-size: 0.75rem;
    }
    .pin-icon {
      display: block;
      position: absolute;
      left: 0.5rem;
      height: 20px; 
      z-index: 10;
    } 
    .results-list {
      width: 115%;
    }
  }
</style>
