// modules
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/widgets/Compass", "esri/widgets/ScaleBar", "esri/renderers/UniqueValueRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/widgets/Expand", "esri/symbols/SimpleFillSymbol"], function (require, exports, Map_1, MapView_1, FeatureLayer_1, Legend_1, Compass_1, ScaleBar_1, UniqueValueRenderer_1, SimpleRenderer_1, SimpleMarkerSymbol_1, Expand_1, SimpleFillSymbol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    Legend_1 = __importDefault(Legend_1);
    Compass_1 = __importDefault(Compass_1);
    ScaleBar_1 = __importDefault(ScaleBar_1);
    UniqueValueRenderer_1 = __importDefault(UniqueValueRenderer_1);
    SimpleRenderer_1 = __importDefault(SimpleRenderer_1);
    SimpleMarkerSymbol_1 = __importDefault(SimpleMarkerSymbol_1);
    Expand_1 = __importDefault(Expand_1);
    SimpleFillSymbol_1 = __importDefault(SimpleFillSymbol_1);
    //basemap and config
    var map = new Map_1.default({
        basemap: "dark-gray",
    });
    var view = new MapView_1.default({
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
        function stopEvtPropagation(e) {
            e.stopPropagation();
        }
        e.ui.components = ["attribution"];
        e.on("mouse-wheel", stopEvtPropagation);
        e.on("double-click", stopEvtPropagation);
        e.on("double-click", ["Control"], stopEvtPropagation);
        e.on("drag", stopEvtPropagation);
        e.on("drag", ["Shift"], stopEvtPropagation);
        e.on("drag", ["Shift", "Control"], stopEvtPropagation);
        e.on("key-down", function (e) {
            var prohibitedKeys = ["+", "-", "Shift", "_", "=", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
            var keyPressed = e.key;
            if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                e.stopPropagation();
            }
        });
    }
    //layers
    // unique values funcion
    function uniqueValues(value, color, label) {
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
    var centersRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            color: '#474749',
            outline: {
                color: '#232227'
            }
        })
    });
    var centers = new FeatureLayer_1.default({
        url: 'https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/centers/FeatureServer/0',
        renderer: centersRenderer
    });
    map.add(centers, 0);
    //lake
    var lakeRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            color: '#9bc4c1',
            outline: {
                width: 0
            }
        })
    });
    var lake = new FeatureLayer_1.default({
        url: 'https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/burullus/FeatureServer/0',
        renderer: lakeRenderer
    });
    map.add(lake, 0);
    //stations
    var stationsRenderer = new SimpleRenderer_1.default({
        label: "Station",
        symbol: new SimpleMarkerSymbol_1.default({
            size: 10,
            color: [0, 255, 255],
            outline: null
        })
    });
    var popupStations = {
        title: "Station",
        content: "<b>Station:</b> {Station_Name} <br> <b>Salinity:</b> {salinity} <br> <b>Hydrogen ion:</b> {hydrogen_ion_concentration} <br> <b>Dissolved Oxygen:</b> {dissolved_oxygen} <br> <b>Ammonia:</b> {ammonia} <br> <b>Nitrite:</b> {Nitrite_values} <br> <b>Fe:</b> {Fe} <br> <b>Electric:</b> {Electric} <br> <b>Dissolved Salt:</b> {Total_dissolved_Salts}",
    };
    var stations = new FeatureLayer_1.default({
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
    var electricRenderer = new UniqueValueRenderer_1.default({
        field: 'gridcode',
        legendOptions: {
            title: "Areas sutible for fishing"
        },
        uniqueValueInfos: [
            uniqueValues('1', "#4d7799", "Sutible"),
            uniqueValues('0', "#b5515b", "Unsutible"),
        ]
    });
    var electric = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric/FeatureServer/0",
        renderer: electricRenderer,
        visible: false
    });
    map.add(electric, 1);
    //electric conductivity
    var electricConColors = ["#41495f", "#45537a", "#49609b", "#4e6dbd", "#5279de", "#5686ff", "#769ffe", "#96b8fe", "#b6d1fd"];
    var electricConRenderer = new UniqueValueRenderer_1.default({
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
    });
    var electricCon = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electrical_conductivity/FeatureServer/0",
        renderer: electricConRenderer,
        visible: false
    });
    map.add(electricCon, 1);
    //electric dissolve
    var electricDisColors = ["#41495f", "#45537a", "#49609b", "#4e6dbd", "#5279de", "#5686ff", "#769ffe", "#96b8fe", "#b6d1fd"];
    var electricDisRenderer = new UniqueValueRenderer_1.default({
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
    });
    var electricDis = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric_dissolve1/FeatureServer/0",
        renderer: electricDisRenderer,
        visible: false
    });
    map.add(electricDis, 1);
    //ammonia
    var ammoniaColors = ["#fffcd4", "#b1cdc2", "#629eb0", "#38627a", "#0d2644"];
    var ammoniaRenderer = new UniqueValueRenderer_1.default({
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
    });
    var ammonia = new FeatureLayer_1.default({
        title: 'Ammonia',
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/ammonia/FeatureServer/0",
        renderer: ammoniaRenderer,
        visible: false
    });
    map.add(ammonia, 1);
    //nitrite
    var nitriteRenderer = new UniqueValueRenderer_1.default({
        field: 'gridcode',
        legendOptions: {
            title: "تركيز النيتريت يجب الا يزيد عن0.1مليجرام/لتر"
        },
        uniqueValueInfos: [
            uniqueValues('0', "#4d7799", "Sutible"),
            uniqueValues('1', "#b5515b", "Unsutible"),
        ]
    });
    var nitrite = new FeatureLayer_1.default({
        title: 'Nitrite',
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/nitrite/FeatureServer/0",
        renderer: nitriteRenderer,
        visible: false
    });
    map.add(nitrite, 1);
    //salinity
    var salinityColors = ["#325361", "#316475", "#2f7589", "#2e859c", "#6e8d99", "#9d978b", "#bcb4a6", "#dbd2c0", "#faefdb"];
    var salinityRenderer = new UniqueValueRenderer_1.default({
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
    });
    var salinity = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/salinity_dissolve/FeatureServer/0",
        renderer: salinityRenderer,
        visible: false
    });
    map.add(salinity, 1);
    //dissolved oxygen
    var oxygenDisColors = ["#282864", "#2b2e80", "#2e349b", "#3039b7", "#333fd3", "#3948e1", "#3e52f0", "#445bff", "#4d91ff"];
    var oxygenDisRenderer = new UniqueValueRenderer_1.default({
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
    });
    var oxygenDis = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/dissolved_oxygen/FeatureServer/0",
        renderer: oxygenDisRenderer,
        visible: false
    });
    map.add(oxygenDis, 1);
    //iron dissolve
    // #00b3ff|#0f9ad5|#1d82ac|#2c6983|#383b42|#50545e|#727681|#9196a5|#aab2c8
    var ironDisColors = ["#00b3ff", "#0f9ad5", "#1d82ac", "#2c6983", "#383b42", "#50545e", "#727681", "#9196a5", "#aab2c8"];
    var ironDisRenderer = new UniqueValueRenderer_1.default({
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
    });
    var ironDis = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/dissolved_oxygen/FeatureServer/0",
        renderer: ironDisRenderer,
        visible: false
    });
    map.add(ironDis, 1);
    //map components
    //north arrow
    var compass = new Compass_1.default({
        view: view
    });
    view.ui.add(compass, "top-right");
    //scalebar
    var scaleBar = new ScaleBar_1.default({
        view: view,
        unit: "metric",
        style: "line"
    });
    view.ui.add(scaleBar, "bottom-right");
    //legend
    function layerInfo(layer, title) {
        return {
            "layer": layer,
            "title": title
        };
    }
    var legend = new Legend_1.default({
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
    });
    var legendExpand = new Expand_1.default({
        view: view,
        content: legend,
        expanded: true
    });
    view.ui.add(legendExpand, "bottom-left");
    //maps menu
    var expandMapsMenu = new Expand_1.default({
        view: view,
        content: document.getElementById("mapsMenu")
    });
    view.ui.add(expandMapsMenu, "top-left");
    var stationCheck = document.getElementById("stations");
    stationCheck.onclick = function () {
        switch (stationCheck.checked) {
            case true:
                stations.visible = true;
                break;
            default:
                stations.visible = false;
                break;
        }
    };
    document.getElementById("ammonia").onclick = function () {
        switch (ammonia.visible) {
            case false:
                ammonia.visible = true;
                electric.visible = false;
                electricCon.visible = false;
                electricDis.visible = false;
                nitrite.visible = false;
                salinity.visible = false;
                oxygenDis.visible = false;
                ironDis.visible = false;
                break;
        }
    };
    document.getElementById("electric").onclick = function () {
        switch (electric.visible) {
            case false:
                electric.visible = true;
                electricCon.visible = false;
                electricDis.visible = false;
                ammonia.visible = false;
                nitrite.visible = false;
                salinity.visible = false;
                oxygenDis.visible = false;
                ironDis.visible = false;
                break;
        }
    };
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
                nitrite.visible = true;
                electric.visible = false;
                electricCon.visible = false;
                electricDis.visible = false;
                ammonia.visible = false;
                salinity.visible = false;
                oxygenDis.visible = false;
                ironDis.visible = false;
                break;
        }
    };
    document.getElementById("salinity").onclick = function () {
        switch (salinity.visible) {
            case false:
                salinity.visible = true;
                nitrite.visible = false;
                electric.visible = false;
                electricCon.visible = false;
                electricDis.visible = false;
                ammonia.visible = false;
                oxygenDis.visible = false;
                ironDis.visible = false;
                break;
        }
    };
    document.getElementById("oxygenDis").onclick = function () {
        switch (oxygenDis.visible) {
            case false:
                oxygenDis.visible = true;
                salinity.visible = false;
                nitrite.visible = false;
                electric.visible = false;
                electricCon.visible = false;
                electricDis.visible = false;
                ammonia.visible = false;
                ironDis.visible = false;
                break;
        }
    };
});
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
//# sourceMappingURL=main.js.map