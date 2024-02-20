<script>
  import { onMount, onDestroy, getContext, setContext } from "svelte";
  import { darkMode, clusterGroupStore } from "../stores";
  import L from "leaflet";
  import customMarker from "$lib/assets/custom-marker.png";
  import customMarkerWhite from "$lib/assets/custom-marker-white-outline.png";

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
    console.log("Creating or updating marker", { mode, latLng, width, height });

    const iconUrl = mode === "dark" ? customMarkerWhite : customMarker;
    let iconHtml = `<img src="${iconUrl}" style="width: ${width}px; height: ${height}px;">`;

    let icon = L.divIcon({
      html: iconHtml,
      className: "map-marker",
      iconSize: L.point(width, height),
    });

    if (marker) {
      console.log("Updating marker icon");
      marker.setIcon(icon);
      $clusterGroupStore && $clusterGroupStore.addLayer(marker);
    } else {
      console.log("Creating new marker and adding to clusterGroup");
      marker = L.marker(latLng, { icon });
      $clusterGroupStore && $clusterGroupStore.addLayer(marker);
      // Log when setting context for layer
      console.log("Setting layer context with new marker");
    }
  }

  onMount(() => {
    if (mapInstance && $clusterGroupStore) {
      console.log(
        "Subscribing to darkMode with available mapInstance and clusterGroup"
      );
      darkMode.subscribe((mode) => {
        createOrUpdateMarker(mode);
      });
    }
  });

  onDestroy(() => {
    console.log("Destroying marker");
    if (marker) {
      marker.remove();
      marker = undefined;
    }
  });
</script>

{#if marker}
  <slot />
{/if}
