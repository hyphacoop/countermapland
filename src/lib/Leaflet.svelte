<script>
  import {
    onMount,
    onDestroy,
    setContext,
    createEventDispatcher,
    tick,
  } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

  import MapToolbar from "./MapToolbar.svelte";

  export let bounds = undefined;
  export let view = undefined;
  export let zoom = undefined;

  const dispatch = createEventDispatcher();

  let map;
  let mapElement;

    // Define the custom control for the toolbar before using it
	const ToolbarControl = L.Control.extend({
    onAdd: function(map) {
      const container = L.DomUtil.create("div", "map-toolbar-container");
      new MapToolbar({
        target: container,
        props: {
          // Pass props here if needed, for example:
          // mapInstance: map
        },
      });
      return container;
    },
  });

  onMount(() => {
    if (!bounds && (!view || !zoom)) {
      throw new Error("Must set either bounds, or view and zoom.");
    }

    map = L.map(mapElement)
      // Expose map events to parent components, e.g to deal with sidebar or other UI components
      .on("zoom", (e) => dispatch("zoom", e))
      .on("popupopen", async (e) => {
        await tick();
        e.popup.update();
      });

    // Add MapTiler layer
    new MaptilerLayer({
      style: "ea23fd9e-d558-4144-8524-437d953095b1", // Your style ID
      apiKey: "mPMxMiVPDDH0atXxMfF6", // Your actual MapTiler API key
    }).addTo(map);


    // Add the custom control to the map in the desired position
    new ToolbarControl({ position: "topright" }).addTo(map);

    markerLayerGroup = L.layerGroup().addTo(map);
  });

  onDestroy(() => {
    map?.remove();
    map = undefined;
  });

  setContext('map', {
		getMap: () => map
	});
 

  $: if (map) {
    if (bounds) {
      map.fitBounds(bounds);
    } else if (view && zoom) {
      map.setView(view, zoom);
    }
  }
</script>

<div class="w-full h-full" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>
