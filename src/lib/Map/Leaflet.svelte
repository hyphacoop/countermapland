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
  import { currentMapStyleId, mapBoundsStore, territoriesVisible } from '$lib/stores';

  export let bounds = undefined;
  export let view = undefined;
  export let zoom = undefined;

  const dispatch = createEventDispatcher();

  let map;
  let mapElement;
  let mtLayer;
  let territoriesLayer = null;

  // Function to fetch and create the territories layer
	async function fetchAndCreateTerritoriesLayer() {
		const url = 'https://native-land.ca/wp-json/nativeland/v1/api/index.php?maps=territories&names';
		try {
			const response = await fetch(url);
			const data = await response.json();
			territoriesLayer = L.geoJSON(data, {
				style: feature => ({
					color: feature.properties.color, // Customize this as needed
					weight: 2,
					opacity: 1,
					fillOpacity: 0.5
				}),
				onEachFeature: (feature, layer) => {
					if (feature.properties && feature.properties.Name) {
						layer.bindPopup(feature.properties.Name);
					}
				}
			});
			// Optionally, you can immediately add the layer to the map here, or control it via the store subscription
		} catch (error) {
			console.error('Error fetching territories data:', error);
		}
	}

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

    // Initialize the map
    map = L.map(mapElement);

    // Set initial view or bounds and initialize mapBoundsStore
    if (bounds) {
        map.fitBounds(bounds);
        // Directly set bounds since fitBounds does not guarantee immediate effect
        mapBoundsStore.set(bounds);
    } else if (view && zoom) {
        map.setView(view, zoom);
    }

    // Wait until the map is fully loaded to set initial bounds if needed and add layers
    map.whenReady(() => {
        if (!bounds) { // Only if bounds were not initially set
            const initialBounds = map.getBounds();
            console.log("Initial bounds set:", initialBounds);
            mapBoundsStore.set(initialBounds);
        }

        // Add MapTiler layer
        mtLayer = new MaptilerLayer({
            Language: "fr",
            style: L.MaptilerStyle.SATELLITE, // Ensure correct spelling of "SATELLITE"
            apiKey: "mPMxMiVPDDH0atXxMfF6", // Your actual MapTiler API key
        }).addTo(map);

        // Add the custom control to the map in the desired position
        new ToolbarControl({ position: "topright" }).addTo(map);
    });

    // Attach event listeners
    map.on("zoom", (e) => dispatch("zoom", e))
       .on('moveend', () => {
            const bounds = map.getBounds();
            mapBoundsStore.set(bounds);
       })
       .on("popupopen", async (e) => {
            await tick();
            e.popup.update();
       });
// Fetch and prepare the territories layer (but don't add it to the map yet)
fetchAndCreateTerritoriesLayer();

// React to changes in the territoriesVisible store
  territoriesVisible.subscribe(visible => {
    if (visible) {
      if (territoriesLayer && !map.hasLayer(territoriesLayer)) {
        territoriesLayer.addTo(map);
      }
    } else {
      if (territoriesLayer && map.hasLayer(territoriesLayer)) {
        map.removeLayer(territoriesLayer);
      }
    }
  });
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
