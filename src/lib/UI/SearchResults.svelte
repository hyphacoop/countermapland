<script>
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import { currentSidebar } from "$lib/stores";

  import closeImage from "$lib/icons/close.png";

  const dispatch = createEventDispatcher();

  import SearchItem from "./SearchItem.svelte";

  export let results = {};
  export let baseUrl = "";

  $: console.log("results", results);

  function handleDetails(event) {
    dispatch("closeAndShowDetails", { id: event.detail.id, event: event });
  }

  function closeSearch() {
    currentSidebar.set(null);
  }
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
  <button class="close-button" on:click={closeSearch}>
    <img src={closeImage} alt="Close Sidebar" />
  </button>
  <p>
    {results.length}
    {results.length > 1 ? "places " : "place "}
    replied to your call...
  </p>
  {#each results as { name, photos, municipality, id }, index (id + "-" + index)}
    <SearchItem
      {name}
      {photos}
      {municipality}
      {id}
      {baseUrl}
      on:closeAndShowDetails={(event) => handleDetails(event)}
    />
  {/each}
</div>

<style>
  .sidebar {
    background: #ffd966;
    width: 550px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9999;
    padding: 0 1.25rem;
    padding-top: 2.69rem;
  }
  .close-button {
    position: absolute;
    top: 1.19rem;
    right: 1.19rem;
  }
</style>
