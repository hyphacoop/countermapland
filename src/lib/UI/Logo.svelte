<script>
  import { onMount } from "svelte";

  import svgLogo from "$lib/icons/logo.svg";
  import { base } from "$app/paths";
  import { darkMode } from "$lib/stores";

  
  export let showOnMobile = false;
  let iconHtml;
  let isMobileScreen = false; 

  onMount(() => {
    // Check if screen width is less than or equal to 768px
    isMobileScreen = window.innerWidth <= 768;
  });

  $: iconHtml =
    $darkMode === "dark"
      ? `<div style="width: 16rem; height: auto; filter: invert(100%);">
          <img src="${svgLogo}" alt="*countermap" style="width: 100%; height: 100%;" />
        </div>`
      : `<div style="width: 16rem; height: auto;">
          <img src="${svgLogo}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`;
</script>

<h1 style="display: {isMobileScreen && !showOnMobile ? 'none' : 'block'};">
  <a href="{base}/">
    {@html iconHtml}
  </a>
</h1>

<style>
  h1 {
    margin-top: 1rem;
    z-index: 10001 !important;
  }
</style>
