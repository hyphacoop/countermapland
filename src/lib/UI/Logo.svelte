<script>
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { darkMode } from "$lib/stores";

  
  export let showOnMobile = false;
  let isMobileScreen = false; 

  onMount(() => {
    // Check if screen width is less than or equal to 768px
    isMobileScreen = window.innerWidth <= 768;
  });

</script>

<h1 class={$darkMode === "dark" ? "darkmode" : ""} style="display: {isMobileScreen && !showOnMobile ? 'none' : 'block'};">
  <a href="{base}/">
    <span>*</span>
    countermap
  </a>
</h1>

<style>
   .darkmode {
    color: white;
    text-shadow: 1px 1px 1px rgb(0, 0, 0);
  }
  h1 {
    margin-top: 1rem;
    z-index: 10001 !important;
    font-family: "BCSans";
    font-weight: 600;
    font-size: 2.5rem;
  }
  span {
    position:absolute;
    font-family: "Itim";
    margin-top:-1.5rem;
    margin-left:-1.35rem;
    font-size: 4rem;
    font-weight: 400;
  }
</style>
