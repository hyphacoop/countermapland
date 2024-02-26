<script>
    import monumentSvg from '$lib/icons/monument.svg';

    export let width;
    export let height;
    export let name;
    export let municipality;
    export let id;
    export let description;
    export let photos;
    export let baseUrl;
    export let onLearnMoreClicked;
  </script>
  
  {#if photos && photos.length}
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
      <button on:click={onLearnMoreClicked} class="learn-more-button">learn more</button>
    </div>
  </div>
  
  <style>
  img.photos  {
    width: auto;
    height: 100px;
    object-fit: contain;
    margin: 5px;
    border: 0.075rem solid #000;
  }

  img.main.single {
    height: 115%;
  }

  .monument-id {
    color: #000;
    font-family: "Noto Sans Mono";
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .image-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    perspective: 100rem;
    margin: 1.25rem 0rem;
    height: 100px;
  }

  .image-container img.main {
    z-index: 2;
    transition: transform 0.3s ease;
    position: relative;
  }

  .image-container img.side {
    height: 90px;
    position: absolute;
    transition: transform 0.3s ease;
    z-index: 1;
  }

  .image-container img.left {
    left: 0%;
    top: 15%;
    transform: rotateZ(5deg);
  }

  .image-container img.right {
    right: 0%;
    top: 15%;
    transform: rotateZ(-5deg);
  }

  .image-container img.centered-left {
    transform: translateX(10%) rotateZ(5deg); /* Adjust the percentage as needed */
    z-index: 1;
  }

  .image-container img.centered-right {
    transform: translateX(-10%) rotateZ(-5deg); /* Adjust the percentage as needed */
    z-index: 1;
  }

  .description-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 1rem;
}

.text-truncate {
    max-height: 4.5rem;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
}

.text-truncate::after {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 1.2rem;
    background: linear-gradient(to right, transparent, white 50%);
}
  p.description {
    margin-top: 0.075rem;
  }

  .learn-more-container {
    display: flex;
    justify-content: flex-end; 
    margin-top: 0.5rem; 
}
  .learn-more-button {
    background: none;
    color: black;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
}

.learn-more-button:hover,
.learn-more-button:focus {
    text-decoration: none;
}
  </style>
  