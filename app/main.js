var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/widgets/Compass", "esri/widgets/ScaleBar", "esri/renderers/UniqueValueRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/widgets/Expand", "esri/symbols/SimpleFillSymbol", "esri/geometry/Point"], function (require, exports, Map_1, MapView_1, FeatureLayer_1, Legend_1, Compass_1, ScaleBar_1, UniqueValueRenderer_1, SimpleRenderer_1, SimpleMarkerSymbol_1, Expand_1, SimpleFillSymbol_1, Point_1) {
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
    Point_1 = __importDefault(Point_1);
    //viewport
    var viewWidth = window.innerWidth;
    var viewHeight = window.innerHeight;
    //basemap and map config
    var map = new Map_1.default({
        basemap: 'dark-gray',
    });
    var view = new MapView_1.default({
        container: 'viewDiv',
        map: map,
        center: [30.6845758, 31.4974791],
        zoom: 11,
        ui: {
            components: ['attribution']
        },
        constraints: {
            rotationEnabled: false
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                buttonEnabled: false,
                position: 'bottom-right',
                breakpoint: false,
            },
        },
    });
    //limit zoom and movement
    setInterval(function () {
        var maxZoom = 1000000;
        var minZoom = 50000;
        var maxLong = 31.276932195608637;
        var minLong = 30.38183587513739;
        var maxLat = 31.708265368498985;
        var minLat = 31.22458651642475;
        if (view.scale > maxZoom || view.scale < minZoom) {
            if (viewWidth > viewHeight && viewWidth > 512) {
                view.goTo({
                    zoom: 11,
                });
            }
            else {
                view.goTo({
                    zoom: 9,
                });
            }
        }
        if (view.center.longitude < minLong || view.center.longitude > maxLong
            || view.center.latitude < minLat || view.center.latitude > maxLat) {
            if (viewWidth > viewHeight && viewWidth > 512) {
                view.goTo({
                    center: [30.6845758, 31.4974791],
                });
            }
            else {
                view.goTo({
                    center: [30.8045758, 31.3974791],
                });
            }
        }
    }, 1000);
    //layers
    // unique values funcion
    function uniqueValues(value, color, label) {
        return {
            'value': value,
            'label': label,
            'symbol': {
                'color': color,
                'type': 'simple-fill',
                'style': 'solid',
                'outline': {
                    'style': 'none'
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
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/burullus_centers/FeatureServer/0',
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
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/el_brolod/FeatureServer/0',
        renderer: lakeRenderer
    });
    map.add(lake, 0);
    //stations
    var stationsRenderer = new SimpleRenderer_1.default({
        label: 'Station',
        symbol: new SimpleMarkerSymbol_1.default({
            size: 10,
            color: "yellow",
            outline: null
        })
    });
    var popupStations = {
        title: 'Station',
        content: '<b>Station:</b> {Station_Name} <br> <b>Salinity:</b> {salinity} <br> <b>Hydrogen ion:</b> {hydrogen_ion_concentration} <br> <b>Dissolved Oxygen:</b> {dissolved_oxygen} <br> <b>Ammonia:</b> {ammonia} <br> <b>Nitrite:</b> {Nitrite_values} <br> <b>Fe:</b> {Fe} <br> <b>Electric:</b> {Electric} <br> <b>Dissolved Salt:</b> {Total_dissolved_Salts}',
    };
    var stations = new FeatureLayer_1.default({
        title: 'Stations',
        url: 'https://services5.arcgis.com/5YEjLFPHgN3HHtrE/arcgis/rest/services/stations/FeatureServer/0',
        outFields: [
            'Station_Name',
            'salinity',
            'hydrogen_ion_concentration',
            'dissolved_oxygen',
            'ammonia',
            'Nitrite_values',
            'Fe',
            'Electric',
            'Total_dissolved_Salts',
        ],
        popupTemplate: popupStations,
        renderer: stationsRenderer,
        visible: false
    });
    map.add(stations, 2);
    //suitable places for fish farming
    var suitableRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            color: 'green',
            outline: {
                width: 0
            }
        })
    });
    var suitable = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_places_for_fish_farming/FeatureServer/0',
        renderer: suitableRenderer,
        visible: false
    });
    map.add(suitable, 1);
    //suitable places for fish farming without electric
    var suitableEliRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            color: 'green',
            outline: {
                width: 0
            }
        })
    });
    var suitableEli = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_nitrite_locations/FeatureServer/0',
        renderer: suitableEliRenderer,
        visible: false
    });
    map.add(suitableEli, 1);
    //ammonia
    var ammoniaRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#fffcd4',
                        label: '0.1'
                    },
                    {
                        value: 9,
                        color: '#0d2644',
                        label: '1.3'
                    }
                ]
            }
        ]
    });
    var ammonia = new FeatureLayer_1.default({
        title: 'Ammonia',
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ammonia_fi_dissolve1/FeatureServer/0',
        renderer: ammoniaRenderer,
        visible: false
    });
    map.add(ammonia, 1);
    //dessolved electric
    var electricDisRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#41495f',
                        label: '0.1'
                    },
                    {
                        value: 12,
                        color: '#b6d1fd',
                        label: '1.3'
                    }
                ]
            }
        ]
    });
    var electric = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_electric_fi_dissolve1/FeatureServer/0',
        renderer: electricDisRenderer,
        visible: false
    });
    map.add(electric, 1);
    //electricPOI
    var electricPOIRenderer = new UniqueValueRenderer_1.default({
        field: 'gridcode',
        legendOptions: {
            title: ' '
        },
        uniqueValueInfos: [
            uniqueValues('1', '#4d7799', 'Sutible'),
            uniqueValues('0', '#b5515b', 'Unsutible'),
        ]
    });
    var electricPOI = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/electric_pol_fi/FeatureServer/0',
        renderer: electricPOIRenderer,
        visible: false
    });
    map.add(electricPOI, 1);
    //iron dissolve
    var ironRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: 'red',
                        label: '4.31'
                    },
                    {
                        value: 9,
                        color: 'blue',
                        label: '9.4'
                    }
                ]
            }
        ]
    });
    var iron = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_iron_fi_dissolve1/FeatureServer/0',
        renderer: ironRenderer,
        visible: false
    });
    map.add(iron, 1);
    //nitrite
    var nitriteRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#fffcd4',
                        label: '0.1'
                    },
                    {
                        value: 9,
                        color: '#0d2644',
                        label: '1.3'
                    }
                ]
            }
        ]
    });
    var nitrite = new FeatureLayer_1.default({
        title: 'Nitrite',
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
        renderer: nitriteRenderer,
        visible: false
    });
    map.add(nitrite, 1);
    //dissolved oxygen
    var oxygenRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#4d91ff',
                        label: '4.31'
                    },
                    {
                        value: 9,
                        color: '#282864',
                        label: '9.4'
                    }
                ]
            }
        ]
    });
    var oxygen = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_dissolved_oxygen_fi_1/FeatureServer/0',
        renderer: oxygenRenderer,
        visible: false
    });
    map.add(oxygen, 1);
    //ph
    var phRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: 'red',
                        label: '4.31'
                    },
                    {
                        value: 9,
                        color: 'blue',
                        label: '9.4'
                    }
                ]
            }
        ]
    });
    var ph = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
        renderer: phRenderer,
        visible: false
    });
    map.add(ph, 1);
    //salinity
    var salinityRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#faefdb',
                        label: '0.4'
                    },
                    {
                        value: 9,
                        color: '#325361',
                        label: '30.7'
                    }
                ]
            }
        ]
    });
    var salinity = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_salinity_fi_dissolve1/FeatureServer/0',
        renderer: salinityRenderer,
        visible: false
    });
    map.add(salinity, 1);
    //dissolved salt
    var saltRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#faefdb',
                        label: '0.4'
                    },
                    {
                        value: 9,
                        color: '#325361',
                        label: '30.7'
                    }
                ]
            }
        ]
    });
    var salt = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_total_dissolved_salt1/FeatureServer/0',
        renderer: saltRenderer,
        visible: false
    });
    map.add(salt, 1);
    //temp
    var tempRenderer = new SimpleRenderer_1.default({
        symbol: new SimpleFillSymbol_1.default({
            outline: {
                width: 0
            }
        }),
        visualVariables: [
            {
                // @ts-ignore
                type: 'color',
                field: 'gridcode',
                legendOptions: {
                    title: ' '
                },
                stops: [
                    {
                        value: 1,
                        color: '#faefdb',
                        label: '0.4'
                    },
                    {
                        value: 9,
                        color: '#325361',
                        label: '30.7'
                    }
                ]
            }
        ]
    });
    var temp = new FeatureLayer_1.default({
        url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_temperaature_dissolv1/FeatureServer/0',
        renderer: tempRenderer,
        visible: false
    });
    map.add(temp, 1);
    //map components
    //north arrow
    var compass = new Compass_1.default({
        view: view
    });
    view.ui.add(compass, 'top-right');
    //scalebar
    var scaleBar = new ScaleBar_1.default({
        view: view,
        unit: 'metric',
        style: 'ruler'
    });
    view.ui.add(scaleBar, 'bottom-right');
    //maps menu
    var expandMapsMenu = new Expand_1.default({
        view: view,
        content: document.getElementById('mapsMenu'),
    });
    view.ui.add(expandMapsMenu, 'top-left');
    //legend
    function layerInfo(layer, title) {
        return {
            'layer': layer,
            'title': title
        };
    }
    var legend = new Legend_1.default({
        view: view,
        layerInfos: [
            layerInfo(stations, ''),
            layerInfo(suitable, ''),
            layerInfo(suitableEli, ''),
            layerInfo(ammonia, 'Ammonia'),
            layerInfo(electric, 'Electric Dissolve'),
            layerInfo(electricPOI, 'Electric'),
            layerInfo(iron, 'Iron Dissolve'),
            layerInfo(oxygen, 'Dissolved Oxygen'),
            layerInfo(nitrite, 'Nitrite'),
            layerInfo(ph, 'ph'),
            layerInfo(salinity, 'Salinity'),
            layerInfo(salt, 'Dissolved Salt'),
            layerInfo(temp, 'Temperature'),
        ]
    });
    var legendExpand = new Expand_1.default({
        view: view,
        content: legend,
        expanded: true
    });
    if (viewWidth < viewHeight && viewWidth < 512) {
        view.ui.add(legendExpand, 'top-left');
    }
    else {
        view.ui.add(legendExpand, 'bottom-left');
    }
    //layers
    var checkContainer = document.getElementById('checkContainer');
    var stationCheck = document.getElementById('stations');
    stationCheck.checked = false;
    checkContainer.onclick = function () {
        if (stationCheck.checked) {
            stationCheck.checked = false;
            stations.visible = false;
        }
        else {
            stationCheck.checked = true;
            stations.visible = true;
        }
    };
    function disableLayers() {
        return suitable.visible = false,
            suitableEli.visible = false,
            ammonia.visible = false,
            electric.visible = false,
            electricPOI.visible = false,
            iron.visible = false,
            lake.visible = false,
            nitrite.visible = false,
            oxygen.visible = false,
            ph.visible = false,
            salinity.visible = false,
            salt.visible = false,
            temp.visible = false;
    }
    document.getElementById('suitable').onclick = function () {
        if (!suitable.visible) {
            disableLayers();
            suitable.visible = true;
            lake.visible = true;
        }
    };
    document.getElementById('suitableEli').onclick = function () {
        if (!suitableEli.visible) {
            disableLayers();
            suitableEli.visible = true;
            lake.visible = true;
        }
    };
    document.getElementById('ammonia').onclick = function () {
        if (!ammonia.visible) {
            disableLayers();
            ammonia.visible = true;
        }
    };
    document.getElementById('electric').onclick = function () {
        if (!electric.visible) {
            disableLayers();
            electric.visible = true;
        }
    };
    document.getElementById('electricPOI').onclick = function () {
        if (!electricPOI.visible) {
            disableLayers();
            electricPOI.visible = true;
        }
    };
    document.getElementById('iron').onclick = function () {
        if (!iron.visible) {
            disableLayers();
            iron.visible = true;
        }
    };
    document.getElementById('nitrite').onclick = function () {
        if (!nitrite.visible) {
            disableLayers();
            nitrite.visible = true;
        }
    };
    document.getElementById('oxygen').onclick = function () {
        if (!oxygen.visible) {
            disableLayers();
            oxygen.visible = true;
        }
    };
    document.getElementById('ph').onclick = function () {
        if (!ph.visible) {
            disableLayers();
            ph.visible = true;
        }
    };
    document.getElementById('salinity').onclick = function () {
        if (!salinity.visible) {
            disableLayers();
            salinity.visible = true;
        }
    };
    document.getElementById('salt').onclick = function () {
        if (!salt.visible) {
            disableLayers();
            salt.visible = true;
        }
    };
    document.getElementById('temp').onclick = function () {
        if (!temp.visible) {
            disableLayers();
            temp.visible = true;
        }
    };
    //responive
    if (viewWidth < viewHeight && viewWidth < 512) {
        view.zoom = 9;
        view.center = new Point_1.default({
            'longitude': 30.8045758,
            'latitude': 31.3974791,
        });
        legendExpand.expanded = false;
    }
});
//# sourceMappingURL=main.js.map