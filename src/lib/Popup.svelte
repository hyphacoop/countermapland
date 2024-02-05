<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import L from "leaflet";

  let popup;
  let popupElement;
  
  let open = false;

  const layerContext = getContext("layer");
  const layer = layerContext.getLayer();

  onMount(() => {
    popup = L.popup().setContent(popupElement);

	if (layer) {
      layer.bindPopup(popup);
      layer.on("popupopen", () => (open = true));
      layer.on("popupclose", () => (open = false));
    }
  });

  onDestroy(() => {
    if (layer) {
      // Ensure layer is defined before using it
      layer.unbindPopup();
    }
    if (popup) {
      popup.remove();
      popup = undefined;
    }
  });
</script>

<div bind:this={popupElement}>
  {#if open}
    <slot />
  {/if}
</div>
