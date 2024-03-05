<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  import { writable, derived } from "svelte/store";
  import { markersStore, filteredStore } from "$lib/stores";
  import closeImage from "$lib/icons/close.svg";

  import { currentSidebar, filtersActive } from "$lib/stores";

  import uniqueNames from "$lib/assets/dataHelper/uniqueNames.json";
  import uniqueOrganizations from "$lib/assets/dataHelper/uniqueOrgs.json";
  import uniqueMaintainers from "$lib/assets/dataHelper/uniqueMaintainers.json";
  import uniqueTypes from "$lib/assets/dataHelper/uniqueTypes.json";

  import CustomSelect from "$lib/UI/CustomSelect.svelte";

  let selectedType = writable("");
  let selectedOrganization = writable("");
  let selectedMaintainer = writable("");
  let selectedName = writable("");

  // Reactive statement to handle filtering
  $: {
    if (
      $selectedType ||
      $selectedOrganization ||
      $selectedMaintainer ||
      $selectedName
    ) {
      // Perform filtering only if at least one selection is made
      const filtered = $markersStore.filter(
        (marker) =>
          (!$selectedType || marker.type === $selectedType) &&
          (!$selectedOrganization ||
            marker.organization === $selectedOrganization) &&
          (!$selectedMaintainer || marker.maintainer === $selectedMaintainer) &&
          (!$selectedName || marker.name === $selectedName)
      );
      filteredStore.set(filtered);
    } 
  }
  function closeSidebar() {
    currentSidebar.set(null);
    filtersActive.set(false);
  }

  $: console.log();
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
  <button class="close-button" on:click={closeSidebar}>
    <img src={closeImage} alt="Close Sidebar" />
  </button>
  <h2 class="mb-4">Tools</h2>
  <div class="metadata">
    <div class="category">
      <h3>Media</h3>
      <span class="label active"> Image </span>
    </div>
    <div class="category">
      <h3>Type</h3>
      <span class="label active"> monument </span>
      <span class="label"> countermonument </span>
    </div>
    <div class="category">
      <h3>Source</h3>
      <span class="label active"> Canadian military memorials </span>
      <span class="label"> community </span>
    </div>
    <div class="data-group">
      <div class="category">
        <h3>Object</h3>
        <CustomSelect bind:selected={$selectedType} options={uniqueTypes} />
      </div>
      <div class="category">
        <h3>Organization</h3>
        <CustomSelect
          bind:selected={$selectedOrganization}
          options={uniqueOrganizations}
        />
      </div>
      <div class="category">
        <h3>Maintainer</h3>
        <CustomSelect
          bind:selected={$selectedMaintainer}
          options={uniqueMaintainers}
        />
      </div>
      <div class="category">
        <h3>Name</h3>
        <CustomSelect bind:selected={$selectedName} options={uniqueNames} />
      </div>
    </div>
    <div class="future-categories">
      <div class="category">
        <h3>Creator</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Use</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Honourees</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Subject</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Communities</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Issues</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Material</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Size</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Staging</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Gesture</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Actions</h3>
        <CustomSelect />
      </div>
      <div class="category">
        <h3>Language</h3>
        <CustomSelect />
      </div>
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
  .data-group,
  .future-categories {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.5rem;
  }
  .sidebar {
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    background: #efa67e;
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
    margin-bottom: 0.38rem;
  }
  .label {
    font-size: 0.6875rem;
    padding: 0.125rem 0.625rem;
    border: 1px solid #000;
    border-radius: 0.25rem;
  }
  .category {
    margin-bottom: 0.6rem;
    margin-right: 0.25rem;
  }
  .future-categories .category,
  .future-categories h3 {
    margin-bottom: 0.25rem;
    width: 30%;
  }
  .active {
    background-color: #000;
    color: #fff;
  }
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      padding: 0 0.88rem;
      padding-top: 2rem;
    }
  }
</style>
