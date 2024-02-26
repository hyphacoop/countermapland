<script>
    import { createEventDispatcher } from 'svelte';

    import ImageArray from '$lib/UI/ImageArray.svelte';

    import monumentSvg from '$lib/icons/monument.svg';

    export let width;
    export let height;
    export let name;
    export let municipality;
    export let id;
    export let description;
    export let photos;
    export let baseUrl;

    const dispatch = createEventDispatcher();

    function handleLearnMoreClick(event) {
        dispatch('closeAndShowDetails', { id, event });
    }
  </script>
  
  {#if photos && photos.length}
    <ImageArray {photos} {baseUrl} />
  {/if}
  <div class='flex flex-row items-center'>
    <div class='flex flex-col items-start'>
      <h2>{name}</h2>
      <h3>{municipality}</h3>
    </div>
    <div class='flex flex-row items-center'>
        <div class='monument-id'>#{id}</div>
        <div style="width: {width}px; height: {height}px;">
            <img src="{monumentSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
          </div>
    </div>
  </div>
  
  <div class="description-container">
    {#if description}
      <div class="text-truncate">
        <p class="description">{@html description}</p>
      </div>
    {/if}
    <div class="learn-more-container">
      <button on:click={handleLearnMoreClick} class="learn-more-button">learn more</button>
    </div>
  </div>