<script>
    import { createEventDispatcher } from 'svelte';

    import ImageArray from '$lib/UI/ImageArray.svelte';

    import monumentSvg from '$lib/icons/monument.svg';
    import countermonumentSvg from "$lib/icons/countermonument.svg";

    export let width;
    export let height;
    export let name;
    export let municipality;
    export let id;
    export let description;
    export let photos;
    export let baseUrl;
    export let challengesPower;


    let adjusted = challengesPower ? '' : baseUrl;


    const dispatch = createEventDispatcher();

    function handleLearnMoreClick(event) {
        dispatch('closeAndShowDetails', { id, event });
    }
  
    const svgToUse = challengesPower ? countermonumentSvg : monumentSvg;
  </script>
  
  {#if photos && photos.length}
    <ImageArray {photos} baseUrl={adjusted} />
  {/if}
  <div class='flex flex-row items-center'>
    <div class='flex flex-col items-start'>
      <h2>{name}</h2>
      {#if municipality && municipality !== 'null' && municipality !== 'undefined'}
        <h3>{municipality}</h3>
      {/if}
    </div>
    <div class='flex flex-row items-center'>
        <div class='monument-id'>#{id}</div>
        <div style="width: {width}px; height: {height}px;">
            <img src="{svgToUse}" alt="Monument Marker" style="width: 100%; height: 100%; {challengesPower ? 'margin-left:5px' : ''}" />
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