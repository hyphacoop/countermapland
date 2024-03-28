<script>
    import { createEventDispatcher } from 'svelte';

    import ImagePreview from '$lib/UI/ImagePreview.svelte';

    import monumentSvg from '$lib/icons/monument.svg';
    import countermonumentSvg from "$lib/icons/countermonument.svg";

    let width = 30;
    let height = 30;


    export let name;
    export let municipality;
    export let challengesPower;
    export let id;
    export let photos;
    export let baseUrl;

    const dispatch = createEventDispatcher();

    function handleLearnMoreClick(event) {
        dispatch('closeAndShowDetails', { id, event });
    }

    const svgToUse = challengesPower ? countermonumentSvg : monumentSvg;
  </script>

<div class="result-container flex flex-row justify-between items-stretch p-3 lg:p-4 border border-black bg-white m-2 rounded-sm">
    {#if photos && photos.length}
        <ImagePreview {photos} {baseUrl} />
    {/if}

    <div class='flex flex-col items-start ml-7 space-y-2'>
        <div class='monument-id'>#{id}</div>
        <h2>{name}</h2>
        {#if municipality && municipality !== 'null' && municipality !== 'undefined'}
        <h3>{municipality}</h3>
        {/if}
    </div>

    <div class="flex flex-col flex-wrap justify-between items-end">        
        <div style="width: {width}px; height: {height}px;">
            <img src="{svgToUse}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>
        <div class="flex-grow"></div>
        <div>
            <button on:click={handleLearnMoreClick} class="learn-more-button">learn more</button>
        </div>
    </div>
</div>



<style>
    button {
        font-size: 0.6875rem; 
        width: max-content;
    }
    .result-container {
        border: 1px solid transparent; 
    }
    .result-container:hover {
        border-radius: 0.25rem;
        border: 1px solid #000; 
    }
</style>