<script>
  import svgLogo from "$lib/icons/logo.svg";

  import { darkMode } from "$lib/stores";

  let iconHtml;

  $: iconHtml =
    $darkMode === "dark"
      ? `<div style="width: 16rem; height: auto; filter: invert(100%);">
          <img src="${svgLogo}" alt="*countermap" style="width: 100%; height: 100%;" />
        </div>`
      : `<div style="width: 16rem; height: auto;">
          <img src="${svgLogo}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`;
</script>

<h1>
  {@html iconHtml}
</h1>

<style>
  h1 {
    margin-top: 1rem;
  }
  @media (max-width: 768px) {
    h1 {
      display: none;
    }
  }
</style>
