<script>
  // calcite components
  import "@esri/calcite-components/dist/components/calcite-shell";
  import "@esri/calcite-components/dist/components/calcite-shell-panel";
  import "@esri/calcite-components/dist/components/calcite-action";
  import "@esri/calcite-components/dist/components/calcite-action-bar";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-label";
  import "@esri/calcite-components/dist/components/calcite-rating";

  // arcgis js api
  import config from "@arcgis/core/config";
  import WebMap from "@arcgis/core/WebMap";
  import MapView from "@arcgis/core/views/MapView";
  import Bookmarks from "@arcgis/core/widgets/Bookmarks";
  import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
  import LayerList from "@arcgis/core/widgets/LayerList";
  import Legend from "@arcgis/core/widgets/Legend";
  import Print from "@arcgis/core/widgets/Print";
  import { onMount } from "svelte";

  config.apiKey = import.meta.env.VITE_API_KEY;

  let viewContainer;

  let bookmarksContainer;
  let bmgContainer;
  let layerListContainer;
  let legendContainer;
  let printContainer;

  let item = {};

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

    const basemaps = new BasemapGallery({
      view,
      container: bmgContainer,
    });
    const bookmarks = new Bookmarks({
      view,
      container: bookmarksContainer,
    });
    const layerList = new LayerList({
      view,
      selectionEnabled: true,
      container: layerListContainer,
    });
    const legend = new Legend({
      view,
      container: legendContainer,
    });
    const print = new Print({
      view,
      container: printContainer,
    });

    map.when(() => {
      item = map.portalItem;
    });
  });

  let activeWidget;

  const handleActionBarClick = ({ target }) => {
    if (target.tagName !== "CALCITE-ACTION") {
      return;
    }

    if (activeWidget) {
      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
      document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
    }

    const nextWidget = target.dataset.actionId;
    if (nextWidget !== activeWidget) {
      document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
      document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
      activeWidget = nextWidget;
    } else {
      activeWidget = null;
    }
  };
</script>

<calcite-shell content-behind>
  <h2 id="header-title" slot="header">
    <!-- Dynamically populated -->
    {item.title || "...loading"}
  </h2>
  <calcite-shell-panel slot="primary-panel" detached>
    <calcite-action-bar slot="action-bar" on:click={handleActionBarClick}>
      <calcite-action data-action-id="layers" icon="layers" text="Layers" />
      <calcite-action
        data-action-id="basemaps"
        icon="basemap"
        text="Basemaps"
      />
      <calcite-action data-action-id="legend" icon="legend" text="Legend" />
      <calcite-action
        data-action-id="bookmarks"
        icon="bookmark"
        text="Bookmarks"
      />
      <calcite-action data-action-id="print" icon="print" text="Print" />
      <calcite-action
        data-action-id="information"
        icon="information"
        text="Information"
      />
    </calcite-action-bar>

    <calcite-panel
      heading="Layers"
      height-scale="l"
      data-panel-id="layers"
      hidden
    >
      <div id="layers-container" bind:this={layerListContainer} />
    </calcite-panel>
    <calcite-panel
      heading="Basemaps"
      height-scale="l"
      data-panel-id="basemaps"
      hidden
    >
      <div id="basemaps-container" bind:this={bmgContainer} />
    </calcite-panel>
    <calcite-panel
      heading="Legend"
      height-scale="l"
      data-panel-id="legend"
      hidden
    >
      <div id="legend-container" bind:this={legendContainer} />
    </calcite-panel>
    <calcite-panel
      heading="Bookmarks"
      height-scale="l"
      data-panel-id="bookmarks"
      hidden
    >
      <div id="bookmarks-container" bind:this={bookmarksContainer} />
    </calcite-panel>
    <calcite-panel
      heading="Print"
      height-scale="l"
      data-panel-id="print"
      hidden
    >
      <div id="print-container" bind:this={printContainer} />
    </calcite-panel>

    <!-- Info panel (populates with info from the web map) -->
    <calcite-panel heading="Details" data-panel-id="information" hidden>
      <div id="info-content">
        <img
          id="item-thumbnail"
          alt="webmap thumbnail"
          src={item.thumbnailUrl}
        />
        <div id="item-description">
          <!-- Dynamically populated -->
          {item.description}
        </div>
        <calcite-label layout="inline">
          <b>Rating:</b>
          <calcite-rating id="item-rating" read-only>
            <!-- Dynamically populated -->
            {item.avgRating}
          </calcite-rating>
        </calcite-label>
      </div>
    </calcite-panel>
  </calcite-shell-panel>
  <div class="viewDiv" bind:this={viewContainer} />
</calcite-shell>

<style>
  .viewDiv {
    height: 100%;
    width: 100%;
  }

  #header-title {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  #info-content {
    padding: 0.75rem;
  }

  calcite-rating {
    margin-top: 0.25rem;
  }
</style>
