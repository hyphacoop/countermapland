<script>
    import { onMount } from 'svelte';
    import monumentIMG from '$lib/icons/monument.svg';
    import countermonumentIMG from '$lib/icons/countermonument.svg';
  
    let icons = []; // This will store our icons and their properties
  
    // Generate icons with random positions and types
    function generateIcons() {
      const numberOfIcons = 20; // Adjust the number of icons as needed
      for (let i = 0; i < numberOfIcons; i++) {
        const type = Math.random() > 0.5 ? monumentIMG : countermonumentIMG;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDuration = Math.random() * 15 + 1;
        icons.push({ type, left, top, animationDuration });
        console.log('icons', icons);
      }
      return icons;
    }
  
    onMount(() => {
      icons = generateIcons();
    });
  </script>
  
  <div class="mosaic">
    {#if icons.length === 20}
    
    {#each icons as { type, left, top, animationDuration }}
      <img src={type} class="icon" style="left: {left}%; top: {top}%; animation-duration: {animationDuration}s; filter: invert(100%); {type = countermonumentIMG ? 'width: 2.5%; height: 2.5%;' : ''}" alt='monument icon'/>
    {/each}
  
    {/if}
</div>
  
  <style>
    .mosaic {
        width: 100%;
      height: 100%;
      z-index: 1;
      overflow: hidden;
    }
    .icon {
      position: absolute;
      animation: blink 2s infinite;
    }
  
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  </style>
  