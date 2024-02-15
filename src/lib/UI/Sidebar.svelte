<script>
    import { fly } from 'svelte/transition';
    export let selectedObject = [];
</script>
  

  
    <div class="sidebar" in:fly={{ x: 300, duration: 800 }} out:fly={{ x: 300, duration: 800 }}>
      {#each selectedObject as { latLng, visible, name, description, photos }, index (latLng.join(',') + '-' + index)}
        {#if visible}
          <div class="marker">
            <h3>{name}</h3>
            {#if photos && photos.length}
              <div class='flex flex-row'>
                {#each photos as {url, alt}}
                  <img src={`https://www.veterans.gc.ca/images/remembrance/memorials/national-inventory-canadian-memorials/mem/${url}`} alt="{alt}" style="height:auto;">
                {/each}
              </div>
            {/if}
            {#if description}
              <p class="description">        
                {@html description}
              </p>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  

  <style>
    .sidebar {
      width: 450px;
      height: 100%;
      position: fixed;
      top: 0;
      right: 0;
      background-color: white;
      box-shadow: -2px 0 5px rgba(0,0,0,0.5);
      overflow-y: auto;
      z-index: 100;
    }
  
    .description {
      overflow-y: auto;
      padding: 10px;
    }
  
    .flex-row {
      display: flex;
      overflow-x: auto;
    }
  </style>