<script>
  // arcgis js api
  import config from "@arcgis/core/config";
  import WebMap from "@arcgis/core/WebMap";
  import MapView from "@arcgis/core/views/MapView";

  import { onMount } from "svelte";

  import AppShell from "./AppShell.svelte";

  import { state } from "./store";

  config.apiKey = import.meta.env.VITE_API_KEY;

  let viewContainer;
  onMount(() => {
    const map = new WebMap({
      portalItem: {
        id: "cc3bd744b9a44feaa493dd867a1d48dd",
      },
    });
    const view = new MapView({
      container: viewContainer,
      map,
      padding: {
        left: 49,
      },
    });

    view.ui.move("zoom", "bottom-right");

    map.when(() => {
      $state.view = view;
      $state.item = map.portalItem;
    });
  });
</script>

<AppShell>
  <div class="viewDiv" bind:this={viewContainer} />
</AppShell>

<style>
  .viewDiv {
    height: 100%;
    width: 100%;
  }
</style>
