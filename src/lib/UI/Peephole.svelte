<script>
  export let onMapStyleSelect;

  import { currentMapStyleIndex } from "$lib/stores";

  import territoriesImage from "$lib/icons/peephole/map-territories.webp";
  import streetsImage from "$lib/icons/peephole/map-streets.webp";
  import satelitteImage from "$lib/icons/peephole/map-satellite.webp";

  let mapStyleId;
  currentMapStyleIndex.subscribe((value) => {
    mapStyleId = value;
  });

  let mapStyles = [
    {
      id: 0,
      src: satelitteImage,
      alt: "Map Style: Satellite",
    },
    {
      id: 1,
      src: streetsImage,
      alt: "Map Style: Streets",
    },
    {
      id: 2,
      src: territoriesImage,
      alt: "Map Style: Territories",
    },
  ];

  // Filter out the current map style
  $: visibleMapStyles = mapStyles.filter((style) => style.id !== mapStyleId);

  $: console.log('currentMapStyleId', mapStyleId);
</script>

<div class="peephole-container">
  {#each visibleMapStyles as { id, src, alt }}
    <button on:click={() => onMapStyleSelect(id)}>
      <img {src} {alt} />
    </button>
  {/each}
</div>

<style>
  .peephole-container {
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
  }
  .peephole-container button {
    width: 5rem;
    height: 5rem;
    margin-bottom: 0.15rem;
    padding: 0.25rem;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  .peephole-container button:hover {
    transform: scale(1.1);
  }
  .peephole-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    .peephole-container button {
      width: 4rem;
      height: 4rem;
      margin-right: 0.5rem;
    }
  }
</style>
