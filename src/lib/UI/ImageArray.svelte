<script>
    export let photos = [];
    export let baseUrl = "";
</script>

<div class="image-container">
    {#if photos && photos.length === 1}
        <img
        src={`${baseUrl}${photos[0].url}`}
        alt={photos[0].alt}
        class="photos main single"
        />
    {:else if photos.length === 2}
        <img
        src={`${baseUrl}${photos[0].url}`}
        alt={photos[0].alt}
        class="photos centered-left"
        />
        <img
        src={`${baseUrl}${photos[1].url}`}
        alt={photos[1].alt}
        class="photos centered-right"
        />
    {:else if photos.length >= 3}
        <img
        src={`${baseUrl}${photos[1].url}`}
        alt={photos[1].alt}
        class="photos side left"
        />
        <img
        src={`${baseUrl}${photos[0].url}`}
        alt={photos[0].alt}
        class="photos main"
        />
        <img
        src={`${baseUrl}${photos[2].url}`}
        alt={photos[2].alt}
        class="photos side right"
        />
    {/if}
</div>