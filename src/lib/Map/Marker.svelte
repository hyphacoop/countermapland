<script>
  import { onMount, onDestroy, getContext, setContext } from "svelte";
  import { darkMode, clusterGroupStore, isMarkersVisible } from "../stores";
  import L from "leaflet";

  import monumentSvg from "$lib/icons/monument.svg";
  import countermonumentSvg from "$lib/icons/countermonument.svg";

  export let width;
  export let height;
  export let latLng;

  export let challengesPower = false;

  let marker;
  let mapInstance = getContext("map").getMap();

  setContext("layer", {
    getLayer: () => marker
  });

  function createOrUpdateMarker(mode) {
    const svgToUse = challengesPower ? countermonumentSvg : monumentSvg;
    let iconHtml = mode === "dark"
      ? `<div style="width: ${width}px; height: ${height}px; filter: invert(100%);">
          <img src="${svgToUse}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`
      : `<div style="width: ${width}px; height: ${height}px;">
          <img src="${svgToUse}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`;

    let icon = L.divIcon({
      html: iconHtml,
      className: "map-marker",
      iconSize: L.point(width, height),
    });

    // Update or create marker logic
    if (marker) {
      $clusterGroupStore.removeLayer(marker); // Ensure marker is removed before updating to avoid duplicates
      marker.setIcon(icon);
    } else {
      marker = L.marker(latLng, { icon });
    }
    $clusterGroupStore.addLayer(marker);
  }

  onMount(() => {
    if (mapInstance && $clusterGroupStore) {
      darkMode.subscribe((mode) => {
        createOrUpdateMarker(mode);
      });
    }
  });

  $: if (marker && $clusterGroupStore) {
    if ($isMarkersVisible) {
      $clusterGroupStore.addLayer(marker);
    } else {
      $clusterGroupStore.removeLayer(marker);
    }
  };

  onDestroy(() => {
    if (marker && $clusterGroupStore) {
      $clusterGroupStore.removeLayer(marker);
      marker.remove();
      marker = undefined;
    }
  });
</script>

{#if marker}
  <slot />
{/if}