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
  import "leaflet.markercluster/dist/leaflet.markercluster.js";
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";

  import { addTerritoriesLayer, addTerritoriesLabels } from "./utilities";
  import { MaptilerLayer, MaptilerStyle } from "@maptiler/leaflet-maptilersdk";

  import pinSvg from "$lib/icons/pin.svg";

  import Toolbar from "./Toolbar.svelte";
  import {
    currentMapStyleId,
    currentMapStyleIndex,
    mapBoundsStore,
    territoriesVisible,
    clusterGroupStore,
    darkMode,
    currentSidebar,
    filteredStore,
    filtersActive,
    userLatLng,
    mapInstanceStore,
  } from "$lib/stores";

  export let bounds = undefined;
  export let view = undefined;
  export let zoom = undefined;

  const dispatch = createEventDispatcher();

  let map;
  let mapElement;
  let mtLayer;
  let territoriesLayer = null;
  let labelsLayer = null;
  let marker;
  let icon;
  let territoriesData = null;

  
  $: {
  let iconHtml = $darkMode === "dark"
    ? `<div style="width: 30px; height: 40px; filter: invert(100%);">
        <img src="${pinSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
      </div>`
    : `<div style="width: 30px; height: 40px;">
        <img src="${pinSvg}" alt="Monument Marker" style="width: 100%; height: 100%;" />
      </div>`;

  icon = L.divIcon({
    html: iconHtml,
    className: "map-marker",
    iconSize: L.point(25, 65),
  });
}

// Reactive statement for removing the marker when not in submissions mode
$: if ($currentSidebar !== "submissions" && marker) {
    map.removeLayer(marker);
    marker = null; 
  }

  async function initializeTerritories(map) {
    if (!territoriesData) {
      try {
        const response = await fetch(
          "https://native-land.ca/wp-json/nativeland/v1/api/index.php?maps=territories"
        );
        territoriesData = await response.json();

        // Assuming addTerritoriesLayer and addTerritoriesLabels are now properly returning the layers
        territoriesLayer = await addTerritoriesLayer(map, territoriesData);
        labelsLayer = await addTerritoriesLabels(map, territoriesData);
      } catch (error) {
        console.error("Error fetching territories data:", error);
      }
    }
  }

  // Define the custom control for the toolbar before using it
  const ToolbarControl = L.Control.extend({
    onAdd: function (map) {
      const container = L.DomUtil.create("div", "map-toolbar-container");
      new Toolbar({
        target: container,
        props: {
          mapInstance: map,
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
    map = L.map(mapElement, {
      maxZoom: 18,
      zoomControl: false,
    });

    // Initialize MarkerClusterGroup
    const clusterGroup = L.markerClusterGroup({
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: false,
    });
    map.addLayer(clusterGroup);
    clusterGroupStore.set(clusterGroup);

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
      if (!bounds) {
        // Only if bounds were not initially set
        const initialBounds = map.getBounds();
        mapBoundsStore.set(initialBounds);
      }
      mapInstanceStore.set(map);
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
    map
      .on('click', function(e) {
        if ($currentSidebar === "submissions") {
         
        // Update the store with the clicked location's latLng
        userLatLng.set(e.latlng);

        // Check if a marker already exists, remove it
        if (marker) {
          map.removeLayer(marker);
        }

        // Create a new marker at the clicked location
        marker = L.marker([e.latlng.lat, e.latlng.lng], { icon }).addTo(map);
        }
      })
      .on("zoom", (e) => dispatch("zoom", e))
      .on("moveend", () => {
        const bounds = map.getBounds();
        mapBoundsStore.set(bounds);
      })
      .on("popupopen", async (e) => {
        e.popup.update();
        await tick();
      });
  });

  function addTerritories() {
    console.log("Adding territories");
    if (map) {
      if (!territoriesLayer || !labelsLayer) {
        initializeTerritories(map); 
      } else {
        map.addLayer(territoriesLayer);
        map.addLayer(labelsLayer);
      }
    }
  }

  function removeTerritories() {
    if (map) {
      if (territoriesLayer) map.removeLayer(territoriesLayer);
      if (labelsLayer) map.removeLayer(labelsLayer);
      console.log("Territories removed");
    }
  }

  onDestroy(() => {
    map?.remove();
    map = undefined;
    removeTerritories();
  });

  setContext("map", {
    getMap: () => map,
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
    if ($currentMapStyleIndex === 2) {
      territoriesVisible.set(true);
      darkMode.set("light");
      console.log("setting territoriesVisible to true");
    } else if ($currentMapStyleIndex === 0 ){
      territoriesVisible.set(false);
      darkMode.set("dark");
    } else {
      territoriesVisible.set(false);
      darkMode.set("light");
    }
    if (map && mtLayer) {
      updateMapStyle($currentMapStyleId);
    }
  }

  $: if (
    map &&
    $currentSidebar === "tools" &&
    $filteredStore.length > 0 &&
    $filtersActive
  ) {
    // Calculate bounds from filteredStore
    const bounds = L.latLngBounds(
      $filteredStore.map((marker) => L.latLng(marker.latLng))
    );

    // Adjust the map to these bounds
    map.fitBounds(bounds, { padding: [50, 50] }); // Add some padding for a better view
  }


  // Reactive statement to react to changes in territoriesVisible
  $: $territoriesVisible ? addTerritories() : removeTerritories();
</script>

<div class="w-full h-full" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>

<style>
  :global(.leaflet-control-attribution.leaflet-control) {
    display: none !important; 
  }
  :global(a[href="https://www.maptiler.com"]) {
    display: none !important;
}
</style>
