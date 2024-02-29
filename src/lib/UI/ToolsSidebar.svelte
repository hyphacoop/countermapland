<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
  
    import { writable, derived } from 'svelte/store';
    import { markersStore, filteredStore } from '$lib/stores';
    import closeImage from "$lib/icons/close.png";

    import { currentSidebar } from "$lib/stores";
  
    import CustomSelect from '$lib/UI/CustomSelect.svelte';
  
    let selectedType = writable('');
    let selectedOrganization = writable('');
    let selectedMaintainer = writable('');
    let selectedName = writable('');

    // Derived store that filters markers based on selected criteria
    const filteredMarkers = derived(
    [markersStore, selectedType, selectedOrganization, selectedMaintainer],
    ([$markersStore, $selectedType, $selectedOrganization, $selectedMaintainer]) =>
      $markersStore.filter(marker =>
        (!$selectedType || marker.type === $selectedType) &&
        (!$selectedOrganization || marker.organization === $selectedOrganization) &&
        (!$selectedMaintainer || marker.maintainer === $selectedMaintainer) &&
        (!$selectedName || marker.name === $selectedName)
      )
  );

    // Extract unique values function
    const extractUniqueValues = (data, key) => {
    if (!Array.isArray(data)) return [];
    const allValues = data.map(item => item[key]).filter(Boolean);
    return [...new Set(allValues)].sort();
  };

  let uniqueTypes = [];
  let uniqueOrganizations = [];
  let uniqueMaintainers = [];
  let uniqueNames = [];

  // Subscribe to filteredMarkers to update filteredStore whenever it changes
  filteredMarkers.subscribe((filtered) => {
    filteredStore.set(filtered);
  });

  onMount(() => {
    markersStore.subscribe($markersStore => {
      uniqueTypes = extractUniqueValues($markersStore, 'type');
      uniqueOrganizations = extractUniqueValues($markersStore, 'organization');
      uniqueMaintainers = extractUniqueValues($markersStore, 'maintainer');
      uniqueNames = extractUniqueValues($markersStore, 'name');
    });
  });

  function closeSidebar() {
    currentSidebar.set(null);
  }

  </script>
  
  <div
    class="sidebar"
    in:fly={{ x: 300, duration: 800 }}
    out:fly={{ x: 300, duration: 800 }}
  >
  <button class="close-button" on:click={closeSidebar}>
    <img src={closeImage} alt="Close Sidebar"/>
  </button>
    <h2 class='mb-4'>Tools</h2>
    <div class="metadata">
        <div class="category">
            <h3>Media</h3>
           <span class='label active'>
            Image
           </span>
        </div>
        <div class="category">
            <h3>Type</h3>
           <span class='label active'>
            monument
           </span>
        </div>
        <div class="category">
            <h3>Source</h3>
           <span class='label active'>
            Canadian military memorials
           </span>
        </div>
        <div class="category">
        <h3>Object</h3>
        <CustomSelect bind:selected={$selectedType} options={uniqueTypes} />
    </div>
        <div class="category">
        <h3>Organization</h3>
        <CustomSelect bind:selected={$selectedOrganization} options={uniqueOrganizations} />
        </div>
        <div class="category">
        <h3>Maintainer</h3>
        <CustomSelect bind:selected={$selectedMaintainer} options={uniqueMaintainers} />
        </div>
        <div class="category">
            <h3>Name</h3>
            <CustomSelect bind:selected={$selectedName} options={uniqueNames} />
    
            </div>
      </div>
  </div>
  
  <style>
    .metadata {
        color: #000;
        font-family: "BCSans";
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .sidebar {
      width: 450px;
      height: 100%;
      position: fixed;
      top: 0;
      right: 0;
      background: #EFA67E;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
      overflow-y: auto;
      z-index: 9999;
      padding: 0 1.88rem;
      padding-top: 2.69rem;
    }
    .close-button {
    position: absolute;
    top: 1.19rem;
    right: 1.19rem;
    z-index: 9999;
  }
  h3 {
    font-size: 0.875rem;
    margin-bottom:0.38rem;
  }
  .label {
    font-size: 0.6875rem;
    padding: 0.125rem 0.625rem; 
    border: 1px solid #000;
    border-radius: 0.25rem; 
  }
  .category {
    margin-bottom: 1.06rem;
  }
  .active {
    background-color: #000;
    color: #fff;
  }
  </style>
  