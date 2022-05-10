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
function disableZooming(e: any) {
    e.popup.actions = [];

    function stopEvtPropagation(e: any) {
        e.stopPropagation();
    }

    e.ui.components = ["attribution"];
    e.on("mouse-wheel", stopEvtPropagation);
    e.on("double-click", stopEvtPropagation);
    e.on("double-click", ["Control"], stopEvtPropagation);
    e.on("drag", stopEvtPropagation);
    e.on("drag", ["Shift"], stopEvtPropagation);
    e.on("drag", ["Shift", "Control"], stopEvtPropagation);
    e.on("key-down", (e: any) => {
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

//lake
const lakeRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: '#9bc4c1',
        outline: {
            width: 0
        }
    })
})

const lake = new FeatureLayer({
    url: 'https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/burullus/FeatureServer/0',
    renderer: lakeRenderer
})
map.add(lake, 0)

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
    renderer: stationsRenderer,
    visible: false
});
map.add(stations, 2);

//electric
const electricRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "Areas sutible for fishing"
    },
    uniqueValueInfos: [
        uniqueValues('1', "#4d7799", "Sutible"),
        uniqueValues('0', "#b5515b", "Unsutible"),
    ]
})

const electric = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric/FeatureServer/0",
    renderer: electricRenderer,
    visible: false
})
map.add(electric, 1)

//electric conductivity
const electricConColors = ["#41495f", "#45537a", "#49609b", "#4e6dbd", "#5279de", "#5686ff", "#769ffe", "#96b8fe", "#b6d1fd"];
const electricConRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: " "
    },
    uniqueValueInfos: [
        uniqueValues('0', electricConColors[0]),
        uniqueValues('1', electricConColors[1]),
        uniqueValues('2', electricConColors[2]),
        uniqueValues('3', electricConColors[3]),
        uniqueValues('4', electricConColors[4]),
        uniqueValues('5', electricConColors[5]),
        uniqueValues('6', electricConColors[6]),
        uniqueValues('7', electricConColors[7]),
        uniqueValues('8', electricConColors[8]),
    ]
})

const electricCon = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electrical_conductivity/FeatureServer/0",
    renderer: electricConRenderer,
    visible: false
})
map.add(electricCon, 1)

//electric dissolve
const electricDisColors = ["#41495f", "#45537a", "#49609b", "#4e6dbd", "#5279de", "#5686ff", "#769ffe", "#96b8fe", "#b6d1fd"];
const electricDisRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "mg/L"
    },
    uniqueValueInfos: [
        uniqueValues('0', electricDisColors[0]),
        uniqueValues('1', electricDisColors[1]),
        uniqueValues('2', electricDisColors[2]),
        uniqueValues('3', electricDisColors[3]),
        uniqueValues('4', electricDisColors[4]),
        uniqueValues('5', electricDisColors[5]),
        uniqueValues('6', electricDisColors[6]),
        uniqueValues('7', electricDisColors[7]),
        uniqueValues('8', electricDisColors[8]),
    ]
})

const electricDis = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric_dissolve1/FeatureServer/0",
    renderer: electricDisRenderer,
    visible: false
})
map.add(electricDis, 1)

//ammonia
const ammoniaColors = ["#fffcd4", "#b1cdc2", "#629eb0", "#38627a", "#0d2644"];
const ammoniaRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: " NH3 الحد الأقصى لتركيز الأمونيا الغير متأينة المسموح في مياه المزارع السمكية هو ألايزيد عن0.02مليجرام/لتر"
    },
    uniqueValueInfos: [
        uniqueValues('1', ammoniaColors[0], "< 0.33"),
        uniqueValues('2', ammoniaColors[1], "< 0.41"),
        uniqueValues('3', ammoniaColors[2], "< 0.48"),
        uniqueValues('4', ammoniaColors[3], "< 0.55"),
        uniqueValues('5', ammoniaColors[4], "> 0.67")
    ]
})

const ammonia = new FeatureLayer({
    title: 'Ammonia',
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/ammonia/FeatureServer/0",
    renderer: ammoniaRenderer,
    visible: false
})
map.add(ammonia, 1)

//nitrite
const nitriteRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "تركيز النيتريت يجب الا يزيد عن0.1مليجرام/لتر"
    },
    uniqueValueInfos: [
        uniqueValues('0', "#4d7799", "Sutible"),
        uniqueValues('1', "#b5515b", "Unsutible"),
    ]
})

const nitrite = new FeatureLayer({
    title: 'Nitrite',
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/nitrite/FeatureServer/0",
    renderer: nitriteRenderer,
    visible: false
})
map.add(nitrite, 1)
//salinity
const salinityColors = ["#325361", "#316475", "#2f7589", "#2e859c", "#6e8d99", "#9d978b", "#bcb4a6", "#dbd2c0", "#faefdb"];
const salinityRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "تتباين قدرة الأسماك على تحمل درجات الملوحة المختلفة تبعا ألنواعها"
    },
    uniqueValueInfos: [
        uniqueValues('0', salinityColors[0]),
        uniqueValues('1', salinityColors[1]),
        uniqueValues('2', salinityColors[2]),
        uniqueValues('3', salinityColors[3]),
        uniqueValues('4', salinityColors[4]),
        uniqueValues('5', salinityColors[5]),
        uniqueValues('6', salinityColors[6]),
        uniqueValues('7', salinityColors[7]),
        uniqueValues('8', salinityColors[8]),
    ]
})

const salinity = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/salinity_dissolve/FeatureServer/0",
    renderer: salinityRenderer,
    visible: false
})
map.add(salinity, 1)

//dissolved oxygen
const oxygenDisColors = ["#282864", "#2b2e80", "#2e349b", "#3039b7", "#333fd3", "#3948e1", "#3e52f0", "#445bff", "#4d91ff"];
const oxygenDisRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "الاكسجين الذائب في مياه المزارع السمكية الموصى به لضمان الحفاظ على صحة جيده للأسماك ومعدلات نمو عالية هو ألايقل عن5 مليجرام/لتر"
    },
    uniqueValueInfos: [
        uniqueValues('0', oxygenDisColors[0]),
        uniqueValues('1', oxygenDisColors[1]),
        uniqueValues('2', oxygenDisColors[2]),
        uniqueValues('3', oxygenDisColors[3]),
        uniqueValues('4', oxygenDisColors[4]),
        uniqueValues('5', oxygenDisColors[5]),
        uniqueValues('6', oxygenDisColors[6]),
        uniqueValues('7', oxygenDisColors[7]),
        uniqueValues('8', oxygenDisColors[8]),
    ]
})

const oxygenDis = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/dissolved_oxygen/FeatureServer/0",
    renderer: oxygenDisRenderer,
    visible: false
})
map.add(oxygenDis, 1)

//iron dissolve
// #00b3ff|#0f9ad5|#1d82ac|#2c6983|#383b42|#50545e|#727681|#9196a5|#aab2c8
const ironDisColors = ["#00b3ff", "#0f9ad5", "#1d82ac", "#2c6983", "#383b42", "#50545e", "#727681", "#9196a5", "#aab2c8"];
const ironDisRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: "mg/L"
    },
    uniqueValueInfos: [
        uniqueValues('0', ironDisColors[0]),
        uniqueValues('1', ironDisColors[1]),
        uniqueValues('2', ironDisColors[2]),
        uniqueValues('3', ironDisColors[3]),
        uniqueValues('4', ironDisColors[4]),
        uniqueValues('5', ironDisColors[5]),
        uniqueValues('6', ironDisColors[6]),
        uniqueValues('7', ironDisColors[7]),
        uniqueValues('8', ironDisColors[8]),
    ]
})

const ironDis = new FeatureLayer({
    url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/dissolved_oxygen/FeatureServer/0",
    renderer: ironDisRenderer,
    visible: false
})
map.add(ironDis, 1)

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
        layerInfo(stations, ''),
        layerInfo(ammonia, 'Ammonia'),
        layerInfo(electric, 'Electric'),
        layerInfo(electricCon, 'Electric Conductivity'),
        layerInfo(electricDis, 'Electric Dissolve'),
        layerInfo(nitrite, 'Nitrite'),
        layerInfo(salinity, 'Salinity'),
        layerInfo(oxygenDis, 'Dissolved Oxygen'),
        layerInfo(ironDis, 'Iron Dissolve'),
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

const stationCheck = document.getElementById("stations") as HTMLInputElement;

stationCheck.onclick = function () {
    switch (stationCheck.checked) {
        case true:
            stations.visible = true
            break;
        default:
            stations.visible = false
            break;
    }
}

document.getElementById("ammonia").onclick = function () {
    switch (ammonia.visible) {
        case false:
            ammonia.visible = true
            electric.visible = false
            electricCon.visible = false
            electricDis.visible = false
            nitrite.visible = false
            salinity.visible = false
            oxygenDis.visible = false
            ironDis.visible = false
            break;
    }
}

document.getElementById("electric").onclick = function () {
    switch (electric.visible) {
        case false:
            electric.visible = true
            electricCon.visible = false
            electricDis.visible = false
            ammonia.visible = false
            nitrite.visible = false
            salinity.visible = false
            oxygenDis.visible = false
            ironDis.visible = false
            break;
    }
}

// document.getElementById("electricCon").onclick = function () {
//     switch (electricCon.visible) {
//         case false:
//             electricCon.visible = true
//             electric.visible = false
//             electricDis.visible = false
//             ammonia.visible = false
//             nitrite.visible = false
//             salinity.visible = false
//             oxygenDis.visible = false
//             ironDis.visible = false
//             break;
//     }
// }

// document.getElementById("electricDis").onclick = function () {
//     switch (electricDis.visible) {
//         case false:
//             electricDis.visible = true
//             electric.visible = false
//             electricCon.visible = false
//             ammonia.visible = false
//             nitrite.visible = false
//             salinity.visible = false
//             oxygenDis.visible = false
//             ironDis.visible = false

//             break;
//     }
// }

document.getElementById("nitrite").onclick = function () {
    switch (nitrite.visible) {
        case false:
            nitrite.visible = true
            electric.visible = false
            electricCon.visible = false
            electricDis.visible = false
            ammonia.visible = false
            salinity.visible = false
            oxygenDis.visible = false
            ironDis.visible = false
            break;
    }
}

document.getElementById("salinity").onclick = function () {
    switch (salinity.visible) {
        case false:
            salinity.visible = true
            nitrite.visible = false
            electric.visible = false
            electricCon.visible = false
            electricDis.visible = false
            ammonia.visible = false
            oxygenDis.visible = false
            ironDis.visible = false
            break;
    }
}

document.getElementById("oxygenDis").onclick = function () {
    switch (oxygenDis.visible) {
        case false:
            oxygenDis.visible = true
            salinity.visible = false
            nitrite.visible = false
            electric.visible = false
            electricCon.visible = false
            electricDis.visible = false
            ammonia.visible = false
            ironDis.visible = false
            break;
    }
}

// document.getElementById("ironDis").onclick = function () {
//     switch (ironDis.visible) {
//         case false:
//             ironDis.visible = true
//             oxygenDis.visible = false
//             salinity.visible = false
//             nitrite.visible = false
//             electric.visible = false
//             electricCon.visible = false
//             electricDis.visible = false
//             ammonia.visible = false
//             break;
//     }
// }

