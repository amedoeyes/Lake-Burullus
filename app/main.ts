// modules
import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Legend from 'esri/widgets/Legend';
import Compass from 'esri/widgets/Compass'
import ScaleBar from 'esri/widgets/ScaleBar'
import UniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Expand from 'esri/widgets/Expand';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import Point from 'esri/geometry/Point';

//viewport
const viewWidth = window.innerWidth
const viewHeight = window.innerHeight

//basemap and map config
const map = new Map({
    basemap: 'dark-gray',
});

const view = new MapView({
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
setInterval(() => {
    const maxZoom = 1000000
    const minZoom = 50000
    const maxLong = 31.276932195608637
    const minLong = 30.38183587513739
    const maxLat = 31.708265368498985
    const minLat = 31.22458651642475

    if (view.scale > maxZoom || view.scale < minZoom) {
        if (viewWidth > viewHeight && viewWidth > 512) {
            view.goTo({
                zoom: 11,
            })
        } else {
            view.goTo({
                zoom: 9,
            })
        }
    }
    if (view.center.longitude < minLong || view.center.longitude > maxLong
        || view.center.latitude < minLat || view.center.latitude > maxLat) {
        if (viewWidth > viewHeight && viewWidth > 512) {
            view.goTo({
                center: [30.6845758, 31.4974791],
            })
        } else {
            view.goTo({
                center: [30.8045758, 31.3974791],
            })
        }
    }
}, 1000);

//layers

// unique values funcion
function uniqueValues(value: string, color: string, label?: string) {
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
const centersRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: '#474749',
        outline: {
            color: '#232227'
        }
    })
})

const centers = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/burullus_centers/FeatureServer/0',
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
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/el_brolod/FeatureServer/0',
    renderer: lakeRenderer
})
map.add(lake, 0)

//stations
const stationsRenderer = new SimpleRenderer({
    label: 'Station',
    symbol: new SimpleMarkerSymbol({
        size: 10,
        color: "yellow",
        outline: null
    })
})

const popupStations = {
    title: 'Station',
    content:
        '<b>Station:</b> {Station_Name} <br> <b>Salinity:</b> {salinity} <br> <b>Hydrogen ion:</b> {hydrogen_ion_concentration} <br> <b>Dissolved Oxygen:</b> {dissolved_oxygen} <br> <b>Ammonia:</b> {ammonia} <br> <b>Nitrite:</b> {Nitrite_values} <br> <b>Fe:</b> {Fe} <br> <b>Electric:</b> {Electric} <br> <b>Dissolved Salt:</b> {Total_dissolved_Salts}',
};

const stations = new FeatureLayer({
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
const suitableRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: 'green',
        outline: {
            width: 0
        }
    })
})
const suitable = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_places_for_fish_farming/FeatureServer/0',
    renderer: suitableRenderer,
    visible: false
})
map.add(suitable, 1)

//suitable places for fish farming without electric
const suitableEliRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: 'green',
        outline: {
            width: 0
        }
    })
})
const suitableEli = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_nitrite_locations/FeatureServer/0',
    renderer: suitableEliRenderer,
    visible: false
})
map.add(suitableEli, 1)

//ammonia
const ammoniaRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const ammonia = new FeatureLayer({
    title: 'Ammonia',
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ammonia_fi_dissolve1/FeatureServer/0',
    renderer: ammoniaRenderer,
    visible: false
})
map.add(ammonia, 1)

//dessolved electric
const electricDisRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const electric = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_electric_fi_dissolve1/FeatureServer/0',
    renderer: electricDisRenderer,
    visible: false
})
map.add(electric, 1)

//electricPOI
const electricPOIRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: ' '
    },
    uniqueValueInfos: [
        uniqueValues('1', '#4d7799', 'Sutible'),
        uniqueValues('0', '#b5515b', 'Unsutible'),
    ]
})

const electricPOI = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/electric_pol_fi/FeatureServer/0',
    renderer: electricPOIRenderer,
    visible: false
})
map.add(electricPOI, 1)

//iron dissolve
const ironRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const iron = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_iron_fi_dissolve1/FeatureServer/0',
    renderer: ironRenderer,
    visible: false
})
map.add(iron, 1)

//nitrite
const nitriteRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const nitrite = new FeatureLayer({
    title: 'Nitrite',
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
    renderer: nitriteRenderer,
    visible: false
})
map.add(nitrite, 1)

//dissolved oxygen
const oxygenRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const oxygen = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_dissolved_oxygen_fi_1/FeatureServer/0',
    renderer: oxygenRenderer,
    visible: false
})
map.add(oxygen, 1)
//ph
const phRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const ph = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
    renderer: phRenderer,
    visible: false
})
map.add(ph, 1)

//salinity
const salinityRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const salinity = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_salinity_fi_dissolve1/FeatureServer/0',
    renderer: salinityRenderer,
    visible: false
})
map.add(salinity, 1)

//dissolved salt
const saltRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const salt = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_total_dissolved_salt1/FeatureServer/0',
    renderer: saltRenderer,
    visible: false
})
map.add(salt, 1)

//temp
const tempRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
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
})

const temp = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_temperaature_dissolv1/FeatureServer/0',
    renderer: tempRenderer,
    visible: false
})
map.add(temp, 1)

//map components

//north arrow
const compass = new Compass({
    view: view
});
view.ui.add(compass, 'top-right');

//scalebar
const scaleBar = new ScaleBar({
    view: view,
    unit: 'metric',
    style: 'ruler'
});
view.ui.add(scaleBar, 'bottom-right');

//maps menu
const expandMapsMenu = new Expand({
    view: view,
    content: document.getElementById('mapsMenu'),
})

view.ui.add(expandMapsMenu, 'top-left')

//legend
function layerInfo(layer: any, title: string) {
    return {
        'layer': layer,
        'title': title
    }
}
const legend = new Legend({
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
})
const legendExpand = new Expand({
    view: view,
    content: legend,
    expanded: true
})

if (viewWidth < viewHeight && viewWidth < 512) {
    view.ui.add(legendExpand, 'top-left')
} else {
    view.ui.add(legendExpand, 'bottom-left')
}

//layers
const checkContainer = document.getElementById('checkContainer') as HTMLDivElement;
const stationCheck = document.getElementById('stations') as HTMLInputElement;
stationCheck.checked = false
checkContainer.onclick = function () {
    if (stationCheck.checked) {
        stationCheck.checked = false
        stations.visible = false
    } else {
        stationCheck.checked = true
        stations.visible = true
    }
}

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
        temp.visible = false
}

document.getElementById('suitable').onclick = function () {
    if (!suitable.visible) {
        disableLayers()
        suitable.visible = true
        lake.visible = true
    }
}

document.getElementById('suitableEli').onclick = function () {
    if (!suitableEli.visible) {
        disableLayers()
        suitableEli.visible = true
        lake.visible = true
    }
}

document.getElementById('ammonia').onclick = function () {
    if (!ammonia.visible) {
        disableLayers()
        ammonia.visible = true
    }
}

document.getElementById('electric').onclick = function () {
    if (!electric.visible) {
        disableLayers()
        electric.visible = true
    }
}

document.getElementById('electricPOI').onclick = function () {
    if (!electricPOI.visible) {
        disableLayers()
        electricPOI.visible = true
    }
}

document.getElementById('iron').onclick = function () {
    if (!iron.visible) {
        disableLayers()
        iron.visible = true
    }
}

document.getElementById('nitrite').onclick = function () {
    if (!nitrite.visible) {
        disableLayers()
        nitrite.visible = true
    }
}

document.getElementById('oxygen').onclick = function () {
    if (!oxygen.visible) {
        disableLayers()
        oxygen.visible = true
    }
}

document.getElementById('ph').onclick = function () {
    if (!ph.visible) {
        disableLayers()
        ph.visible = true
    }
}

document.getElementById('salinity').onclick = function () {
    if (!salinity.visible) {
        disableLayers()
        salinity.visible = true
    }
}

document.getElementById('salt').onclick = function () {
    if (!salt.visible) {
        disableLayers()
        salt.visible = true
    }
}

document.getElementById('temp').onclick = function () {
    if (!temp.visible) {
        disableLayers()
        temp.visible = true
    }
}

//responive
if (viewWidth < viewHeight && viewWidth < 512) {
    view.zoom = 9;
    view.center = new Point({
        'longitude': 30.8045758,
        'latitude': 31.3974791,
    });
    legendExpand.expanded = false
}
