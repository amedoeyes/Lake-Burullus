// modules

import Map from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import Legend from "esri/widgets/Legend";
import Compass from "esri/widgets/Compass"
import ScaleBar from "esri/widgets/ScaleBar"
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";
import SimpleRenderer from "esri/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import Expand from "esri/widgets/Expand";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";

//basemap and config
const map = new Map({
    basemap: "dark-gray",
});

const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [30.6845758, 31.4974791],
    zoom: 11,
    ui: {
        components: ["attribution"]
    },
    constraints: {
        rotationEnabled: false
    },
    popup: {
        dockEnabled: true,
        dockOptions: {
            buttonEnabled: false,
            position: "bottom-right",
            breakpoint: false,
        },
    },
});

//lock zoom
view.when(disableZooming);
function disableZooming(e) {
    e.popup.actions = [];

    function stopEvtPropagation(event) {
        event.stopPropagation();
    }

    e.ui.components = ["attribution"];
    e.on("mouse-wheel", stopEvtPropagation);
    e.on("double-click", stopEvtPropagation);
    e.on("double-click", ["Control"], stopEvtPropagation);
    e.on("drag", stopEvtPropagation);
    e.on("drag", ["Shift"], stopEvtPropagation);
    e.on("drag", ["Shift", "Control"], stopEvtPropagation);
    e.on("key-down", (e) => {
        const prohibitedKeys = ["+", "-", "Shift", "_", "=", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
        const keyPressed = e.key;
        if (prohibitedKeys.indexOf(keyPressed) !== -1) {
            e.stopPropagation();
        }
    });
}

//layers

// unique values funcion
function uniqueValues(value: string, color: string, label?: string) {
    return {
        "value": value,
        "label": label,
        "symbol": {
            "color": color,
            "type": "simple-fill",
            "style": "solid",
            "outline": {
                "style": "none"
            }
        },
    };
}

//centers
const centersRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: '#474749',
        outline: {
            color: '#232227'
        }
    })
})

const centers = new FeatureLayer({
    url: 'https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/centers/FeatureServer/0',
    renderer: centersRenderer
})
map.add(centers, 0)

//stations
const stationsRenderer = new SimpleRenderer({
    label: "Station",
    symbol: new SimpleMarkerSymbol({
        size: 10,
        color: [0, 255, 255],
        outline: null
    })
})

const popupStations = {
    title: "Station",
    content:
        "<b>Station:</b> {Station_Name} <br> <b>Salinity:</b> {salinity} <br> <b>Hydrogen ion:</b> {hydrogen_ion_concentration} <br> <b>Dissolved Oxygen:</b> {dissolved_oxygen} <br> <b>Ammonia:</b> {ammonia} <br> <b>Nitrite:</b> {Nitrite_values} <br> <b>Fe:</b> {Fe} <br> <b>Electric:</b> {Electric} <br> <b>Dissolved Salt:</b> {Total_dissolved_Salts}",
};

const stations = new FeatureLayer({
    title: "Stations",
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/stations/FeatureServer/0",
    outFields: [
        "Station_Name",
        "salinity",
        "hydrogen_ion_concentration",
        "dissolved_oxygen",
        "ammonia",
        "Nitrite_values",
        "Fe",
        "Electric",
        "Total_dissolved_Salts",
    ],
    popupTemplate: popupStations,
    renderer: stationsRenderer
});

//electic
const electricRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: " "
    },
    uniqueValueInfos: [
        uniqueValues('1', "blue", "Sutible"),
        uniqueValues('0', "red", "Unsutible"),
    ]
})

const electric = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric/FeatureServer/0",
    renderer: electricRenderer
})


//ammonia

const ammoniaColors = ["#3900b3", "#714dbf", "#9e6b90", "#cf9270", "#ebb698"];
const ammoniaRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "mg/L"
    },
    uniqueValueInfos: [
        uniqueValues('1', ammoniaColors[0]),
        uniqueValues('2', ammoniaColors[1]),
        uniqueValues('3', ammoniaColors[2]),
        uniqueValues('4', ammoniaColors[3]),
        uniqueValues('5', ammoniaColors[4])
    ]
})

const ammonia = new FeatureLayer({
    title: 'Ammonia',
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/ammonia/FeatureServer/0",
    renderer: ammoniaRenderer,
})

//map components

//north arrow
const compass = new Compass({
    view: view
});
view.ui.add(compass, "top-right");

//scalebar
const scaleBar = new ScaleBar({
    view: view,
    unit: "metric",
    style: "line"
});
view.ui.add(scaleBar, "bottom-right");

//legend
function layerInfo(layer: any, title: string) {
    return {
        "layer": layer,
        "title": title
    }
}
const legend = new Legend({
    view: view,
    layerInfos: [
        layerInfo(ammonia, 'Ammonia'),
        layerInfo(electric, 'Electric'),
        layerInfo(stations, ''),
    ]
})

const legendExpand = new Expand({
    view: view,
    content: legend,
    expanded: true
})
view.ui.add(legendExpand, "bottom-left")

//maps menu
const expandMapsMenu = new Expand({
    view: view,
    content: document.getElementById("mapsMenu")
})

view.ui.add(expandMapsMenu, "top-left")

map.add(stations, 1);
document.getElementById("1").onclick = function () {
    map.removeMany([electric])
    map.add(ammonia, 0)

}
document.getElementById("2").onclick = function () {
    map.removeMany([ammonia])
    map.add(electric, 0)

}