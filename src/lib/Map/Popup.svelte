<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import L from "leaflet";

  import { isPopupOpen } from "$lib/stores";

  let popup;
  let popupElement;
  
  let open = false;

  const layerContext = getContext("layer");
  const layer = layerContext.getLayer();

  onMount(() => {
    popup = L.popup().setContent(popupElement);
    popup._initLayout();

	if (layer) {
      layer.bindPopup(popup);
      layer.on("popupopen", () => {
        open = true;
        isPopupOpen.set(true);
        }
      );
      layer.on("popupclose", () => {
        open = false;
        isPopupOpen.set(false);
        }
      );
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

<div bind:this={popupElement} class='popPadding'>
  {#if open}
    <slot {popup}></slot>
  {/if}
</div>


<style>

:global(.leaflet-popup-content-wrapper) {
  border-radius: 0.25rem; 
}

:global(a.leaflet-popup-close-button) {
  right: 5px !important;
  font: 30px 'BCSans' !important;
  color: #000 !important;
}

.popPadding {
  padding-top: 1.56rem;
  width: 300px;
  max-width: 100%;
  box-sizing: border-box;
}

</style>