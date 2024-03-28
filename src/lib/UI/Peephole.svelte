<script>
  export let onMapStyleSelect;

  import { currentMapStyleIndex } from "$lib/stores";

  import territoriesImage from "$lib/icons/peephole/map-territories.webp";
  import streetsImage from "$lib/icons/peephole/map-streets.webp";
  import satelliteImage from "$lib/icons/peephole/map-satellite.webp";

  let mapStyleId;
  currentMapStyleIndex.subscribe((value) => {
    mapStyleId = value;
  });

  let mapStyles = [
    {
      id: 0,
      src: satelliteImage,
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
</script>

<div class="peephole-container">
  {#each mapStyles as { id, src, alt }}
    <button class:active={id === mapStyleId} on:click={() => onMapStyleSelect(id)}>
      <img {src} {alt} style="height:100%;width:100%;"/>
    </button>
  {/each}
</div>

<style>
  .peephole-container {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    width: 3.75rem;
    margin-right: 5px;
  }
  .peephole-container button {
    width: 3.75rem;
    height: 3.75rem;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    transition: transform 0.3s ease;
    border: 0.31rem solid #fff; /* Ensure consistent sizing */
  }
  .peephole-container button.active {
    border-color: black; /* Highlight active button */
  }
  .peephole-container button:hover {
    transform: scale(1.25);
  }
  .peephole-container button img {
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    .peephole-container {
      flex-wrap: wrap;
      align-content: flex-end;
    }
    .peephole-container button {
      width: 2.75rem;
      height: 2.75rem;
    }
  }
</style>
