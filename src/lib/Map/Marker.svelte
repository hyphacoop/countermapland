<script>
  import { onMount, onDestroy, getContext, setContext } from "svelte";
  import { darkMode, clusterGroupStore, isMarkersVisible } from "../stores";
  import L from "leaflet";

  import monumentSvg from "$lib/icons/monument.svg";

  export let width;
  export let height;
  export let latLng;

  let marker;
  let mapInstance = getContext("map").getMap();

  setContext("layer", {
    getLayer: () => marker
  });

  // Function to create and update marker
  function createOrUpdateMarker(mode) {
    let iconHtml;
    if (mode === "dark") {
      // Apply CSS filter to invert colors for dark mode
      iconHtml = `<div style="width: ${width}px; height: ${height}px; filter: invert(100%);">
          <img src="${monumentSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`;
  } else {
    iconHtml = `<div style="width: ${width}px; height: ${height}px;">
          <img src="${monumentSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
        </div>`;
  }

    let icon = L.divIcon({
      html: iconHtml,
      className: "map-marker",
      iconSize: L.point(width, height),
    });

    if (marker) {
      marker.setIcon(icon);
      $clusterGroupStore && $clusterGroupStore.addLayer(marker);
    } else {
      marker = L.marker(latLng, { icon });
      $clusterGroupStore && $clusterGroupStore.addLayer(marker);
    }
  }

  onMount(() => {
    if (mapInstance && $clusterGroupStore) {
      darkMode.subscribe((mode) => {
        createOrUpdateMarker(mode);
      });
    }
  });

 // Reactively handle marker visibility
 $: if (marker && $clusterGroupStore) {
      if ($isMarkersVisible) {
        $clusterGroupStore.addLayer(marker);
      } else {
        $clusterGroupStore.removeLayer(marker);
      }
    };

  onDestroy(() => {
    if (marker) {
      marker.remove();
      marker = undefined;
    }
  });
</script>

{#if marker}
  <slot />
{/if}
