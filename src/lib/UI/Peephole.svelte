<script>
    export let onMapStyleSelect;

    import territoriesImage from "$lib/icons/peephole/map-territories.png";
    import streetsImage from "$lib/icons/peephole/map-streets.png";
    import satelitteImage from "$lib/icons/peephole/map-satellite.png";
  </script>
  
  <div class="peephole-container">
    <button on:click={() => onMapStyleSelect(1)}>
      <img src={streetsImage} alt="Map Style: Streets" />
    </button>
    <button on:click={() => onMapStyleSelect(0)}>
      <img src={satelitteImage} alt="Map Style: Satelitte" />
    </button>
    <button on:click={() => onMapStyleSelect(2)}>
      <img src={territoriesImage} alt="Map Style: Territories" />
    </button>
  </div>
  
  <style>
    .peephole-container {
      display: flex;
      flex-direction: column;
      margin-top: 1rem; 
    }
    .peephole-container button {
    width: 5rem;
    height: 4rem;
    margin-bottom: 0.5rem;
    border-radius: 50%; 
    border: none; /* Remove border */
    padding: 0.25rem; 
    background-color: #FFF; /* Background color, consider matching with your UI theme */
    transition: background-color 0.3s ease; /* Smooth transition for hover effect */
  }
  .peephole-container button:hover {
    background-color: #f0f0f0; /* Slightly darker on hover */
  }
  .peephole-container img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    border-radius: 50%;
  }
  </style>
  