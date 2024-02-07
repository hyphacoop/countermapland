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

  import { MaptilerLayer, MaptilerStyle } from "@maptiler/leaflet-maptilersdk";

  import Toolbar from "./Toolbar.svelte";
  import { currentMapStyleId } from '$lib/stores';

  export let bounds = undefined;
  export let view = undefined;
  export let zoom = undefined;

  const dispatch = createEventDispatcher();

  let map;
  let mapElement;
  let mtLayer;

    // Define the custom control for the toolbar before using it
	const ToolbarControl = L.Control.extend({
    onAdd: function(map) {
      const container = L.DomUtil.create("div", "map-toolbar-container");
      new Toolbar({
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
    mtLayer = new MaptilerLayer({
      Language: "fr",
      style: L.MaptilerStyle.SATELITTE, // Your style ID
      apiKey: "mPMxMiVPDDH0atXxMfF6", // Your actual MapTiler API key
    }).addTo(map);


    // Add the custom control to the map in the desired position
    new ToolbarControl({ position: "topright" }).addTo(map);


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
// Function to update the map style
function updateMapStyle(newStyleId) {
  if (map && mtLayer) {
    // Remove the existing MapTiler layer
    map.removeLayer(mtLayer);

    // Create a new MapTiler layer with the new style
    mtLayer = new MaptilerLayer({
      style: newStyleId, // The new style ID
      apiKey: "mPMxMiVPDDH0atXxMfF6", // Your MapTiler API key
    }).addTo(map);
  }
}

$: if ($currentMapStyleId) {
  console.log('UUUUUpdating map style to', $currentMapStyleId);
  if (map && mtLayer) {
    updateMapStyle($currentMapStyleId);
  }
};
  $: console.log('LEAFLET Current Map Style Index:', $currentMapStyleId);
</script>

<div class="w-full h-full" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>
