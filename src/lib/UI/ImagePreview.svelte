<script>
    export let photos = {};
    export let baseUrl = "";
</script>

<div class="image-container">
    {#if photos && photos.length === 1}
        <img
            src={`${baseUrl}${photos[0].url}`}
            alt={photos[0].alt}
            class="single-photo"
        />
    {:else if photos.length >= 2}
        <img
            src={`${baseUrl}${photos[0].url}`}
            alt={photos[0].alt}
            class="base-photo"
        />
        <img
            src={`${baseUrl}${photos[1].url}`}
            alt={photos[1].alt}
            class="overlay"
        />
    {/if}
</div>
<style>
    .image-container {
        position: relative;
        display: inline-block;
        width: 15%;
    }
    .image-container img {
        display: block;
        max-width: 75px;
        max-height: 75px;
        height: auto;
        border: 1px solid #000;
    }
    .overlay {
        position: absolute;
        left: 100%;
        top: 80%;
        transform: translate(-50%, -50%) scale(0.8);
    }
</style>