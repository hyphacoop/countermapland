<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import closeImage from "$lib/icons/close.svg";

    import { bannerClosed } from "$lib/stores";

    const dispatch = createEventDispatcher();

    let isMobile = false;

    $: isMobile = window.innerWidth < 1100 ? true : false;

    function closeBanner() {
        dispatch("close");
        $bannerClosed = true;
    }
    function openSubmissions() {
        dispatch("openSubmissions");
        $bannerClosed = true;
    }
</script>

<div class='banner'>
    <p class='label'>
        v1.0
    </p>
    <div>
        {#if isMobile}
        <p>
            This version of *countermap uses a 
            <a href="https://open.canada.ca/data/dataset/f62a5118-5f75-4166-9fd9-fff99b3f177c/resource/5b50cdbd-e7c5-4138-bb42-9b014b8ef587"
            target="_blank">
            single dataset
            </a> 
            to test functionality.
            For updates on the project and data availability,
            <a href="https://www.instagram.com/countermap.land/" target="_blank">
                follow us here</a>.  
            In the meantime, help us build this project by 
            <button on:click={openSubmissions}>
                making a submission</button>!
        </p>
        {:else}
        <p>
            This version of *countermap is a 
            <strong>
                work in progress
            </strong>
            . It uses a 
            <a href="https://open.canada.ca/data/dataset/f62a5118-5f75-4166-9fd9-fff99b3f177c/resource/5b50cdbd-e7c5-4138-bb42-9b014b8ef587" target="_blank">
                single dataset
            </a> 
            of Canadian military memorials to test functionality. 
        </p>
        <p>
            For updates on the project and data availability, 
            <a href="https://www.instagram.com/countermap.land/" target="_blank">
                follow us here
            </a>
            . In the meantime, help us build this project by <button on:click={openSubmissions}>making a submission</button>!
        </p>
        {/if}
    </div>
    <button class="close-button" on:click={closeBanner}>
        <img src={closeImage} alt="Close Banner" />
      </button>
</div>

<style>
    .banner {
        position: absolute;
        background: #FFF;
        display: flex;
        padding: 1.125rem 1rem;
        align-items: center;
        gap: 0.75rem;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #000;
    }
    .banner div {
        flex: 1 0 90%; 
        margin-left: 0.75rem;
        padding-right: 2rem;
    }
    .label {
        border-radius: 4px;
        padding: 0 0.62rem;
        border: 1px solid #000;
        background: #000;
        color: #fff;
    }
    a {
        color: #000;
        text-decoration: underline;
    }
    a:hover {
        text-decoration: none;
    }
    button {
        text-decoration: underline;
    }
    @media (max-width: 768px) {
        .banner {
            font-size: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            padding:0.0125rem;
        }
        .banner div {
            margin-left: 0.75rem;
            margin-bottom: 0.5rem;
        }
        .label {
            margin-top: 1.19rem;
            margin-left: 0.75rem;
        }
    }
</style>