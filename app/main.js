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
        renderer: stationsRenderer
    });
    //electic
    var electricRenderer = new UniqueValueRenderer_1.default({
        field: 'gridcode',
        legendOptions: {
            title: " "
        },
        uniqueValueInfos: [
            uniqueValues('1', "blue", "Sutible"),
            uniqueValues('0', "red", "Unsutible"),
        ]
    });
    var electric = new FeatureLayer_1.default({
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/electric/FeatureServer/0",
        renderer: electricRenderer
    });
    //ammonia
    var ammoniaColors = ["#3900b3", "#714dbf", "#9e6b90", "#cf9270", "#ebb698"];
    var ammoniaRenderer = new UniqueValueRenderer_1.default({
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
    });
    var ammonia = new FeatureLayer_1.default({
        title: 'Ammonia',
        url: "https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/ammonia/FeatureServer/0",
        renderer: ammoniaRenderer,
    });
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
            layerInfo(ammonia, 'Ammonia'),
            layerInfo(electric, 'Electric'),
            layerInfo(stations, ''),
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
    map.add(stations, 1);
    document.getElementById("1").onclick = function () {
        map.removeMany([electric]);
        map.add(ammonia, 0);
    };
    document.getElementById("2").onclick = function () {
        map.removeMany([ammonia]);
        map.add(electric, 0);
    };
});
//# sourceMappingURL=main.js.map