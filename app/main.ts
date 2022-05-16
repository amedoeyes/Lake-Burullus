// arcgis modules
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
import watchUtils from 'esri/core/watchUtils';

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
        color: '#b0c4d8',
        outline: {
            width: 0
        }
    }),
    label: 'بحيرة البرلس'
})

const lake = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/el_brolod/FeatureServer/0',
    renderer: lakeRenderer
})
map.add(lake, 0)


//stations
const stationsRenderer = new SimpleRenderer({
    label: 'المحطات',
    symbol: new SimpleMarkerSymbol({
        size: 10,
        color: "#d0ff00",
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
    visible: true
});
map.add(stations, 2);

//suitable places for fish farming
const suitableRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: '#72c66d',
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح الاماكن المناسبة للاستزراع السمكي فى بحيرة البرلس وذلك بأخذ كل العوامل'
})
const suitable = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_places_for_fish_farming/FeatureServer/0',
    renderer: suitableRenderer,
    visible: true
})
map.add(suitable, 1)

//ammonia
const ammoniaRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح كمية الأمونيا الذائبة في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#e6faff',
                    label: '0.1'
                },
                {
                    value: 9,
                    color: '#435c6c',
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
    visible: true
})
map.add(ammonia, 1)

//dessolved electric
const electricDisRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح نسبة التوصيل الكهربائي في بحيرة البرلس',
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
                    color: '#e6e1ff',
                    label: '5.71'
                },
                {
                    value: 12,
                    color: '#5a4a78',
                    label: '5181'
                }
            ]
        }
    ]
})

const electric = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_electric_fi_dissolve1/FeatureServer/0',
    renderer: electricDisRenderer,
    visible: true
})
map.add(electric, 1)

//electricPOI
const electricPOIRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: 'طبقة توضح المناطق الملائمة والغير ملائمة للتوصيل الكهربائي في بحيرة البرلس'
    },
    uniqueValueInfos: [
        uniqueValues('1', '#6690ff', 'ملائم'),
        uniqueValues('0', '#ff9573', 'غير ملائم'),
    ]
})

const electricPOI = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/electric_pol_fi/FeatureServer/0',
    renderer: electricPOIRenderer,
    visible: true
})
map.add(electricPOI, 1)

//suitable places for electric
const suitableEliRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        color: '#8b87e4',
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح المناطق المناسبة للتوصيل الكهربائي'
})
const suitableEli = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/suitable_nitrite_locations/FeatureServer/0',
    renderer: suitableEliRenderer,
    visible: true
})
map.add(suitableEli, 1)

//iron dissolve
const ironRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح كمية الحديد الذائب في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#fff5e6',
                    label: '0.01'
                },
                {
                    value: 9,
                    color: '#594439',
                    label: '0.91'
                }
            ]
        }
    ]
})

const iron = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_iron_fi_dissolve1/FeatureServer/0',
    renderer: ironRenderer,
    visible: true
})
map.add(iron, 1)

//nitrite
const nitriteRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح كمية النيتريت الذائب في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#ccafaf',
                    label: '0'
                },
                {
                    value: 9,
                    color: '#ff1947',
                    label: '0.5'
                }
            ]
        }
    ]
})

const nitrite = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
    renderer: nitriteRenderer,
    visible: true
})
map.add(nitrite, 1)

//nitritePOI
const nitritePOIRenderer = new UniqueValueRenderer({
    field: 'gridcode',
    legendOptions: {
        title: 'طبقة توضح المناطق الملائمة والغير ملائمة للنتريت في بحيرة البرلس'
    },
    uniqueValueInfos: [
        uniqueValues('1', '#6690ff', 'ملائم'),
        uniqueValues('0', '#ff9573', 'غير ملائم'),
    ]
})

const nitritePOI = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/nitrite_pol_fi/FeatureServer/0',
    renderer: nitritePOIRenderer,
    visible: true
})
map.add(nitritePOI, 1)

//dissolved oxygen
const oxygenRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        },
    }),
    label: 'طبقة توضح كمية الاكسجين الذائب في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#00b7ff',
                    label: '4.31'
                },
                {
                    value: 9,
                    color: '#0062a8',
                    label: '9.4'
                }
            ]
        }
    ]
})

const oxygen = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_dissolved_oxygen_fi_1/FeatureServer/0',
    renderer: oxygenRenderer,
    visible: true
})
map.add(oxygen, 1)

//ph
const phRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح كمية الأس الهيدوجيني الذائب في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#e566ff',
                    label: '7.8'
                },
                {
                    value: 9,
                    color: '#690cc2',
                    label: '9.1'
                }
            ]
        }
    ]
})

const ph = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_ph_fi_dissolve1/FeatureServer/0',
    renderer: phRenderer,
    visible: true
})
map.add(ph, 1)

//salinity
const salinityRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقه توضح نسبة الملوحة في بحيرة البرلس',
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
                    color: '#0080ff',
                    label: '0.4'
                },
                {
                    value: 9,
                    color: '#ff4d4d',
                    label: '30.7'
                }
            ]
        }
    ]
})

const salinity = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_salinity_fi_dissolve1/FeatureServer/0',
    renderer: salinityRenderer,
    visible: true
})
map.add(salinity, 1)

//dissolved salt
const saltRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح كمية الاملاح الكليه الذائبه في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'mg/L'
            },
            stops: [
                {
                    value: 1,
                    color: '#faefdb',
                    label: '8.13'
                },
                {
                    value: 9,
                    color: '#325361',
                    label: '5471'
                }
            ]
        }
    ]
})

const salt = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_total_dissolved_salt1/FeatureServer/0',
    renderer: saltRenderer,
    visible: true
})
map.add(salt, 1)

//temp
const tempRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
        outline: {
            width: 0
        }
    }),
    label: 'طبقة توضح درجة الحرارة في بحيرة البرلس',
    visualVariables: [
        {
            // @ts-ignore
            type: 'color',
            field: 'gridcode',
            legendOptions: {
                title: 'C'
            },
            stops: [
                {
                    value: 1,
                    color: '#ffa200',
                    label: '22.3'
                },
                {
                    value: 9,
                    color: '#ff4a0d',
                    label: '22.88'
                }
            ]
        }
    ]
})

const temp = new FeatureLayer({
    url: 'https://services3.arcgis.com/cc6ApLzpdJeUYlkB/arcgis/rest/services/extract_temperaature_dissolv1/FeatureServer/0',
    renderer: tempRenderer,
    visible: true
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
const mapsMenuExpand = new Expand({
    view: view,
    content: document.getElementById('mapsMenu'),
    expanded: true,
})

view.ui.add(mapsMenuExpand, 'top-left')

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
        layerInfo(lake, ''),
        layerInfo(suitable, 'أفضل اماكن للأستزراع السمكي'),
        layerInfo(ammonia, 'كمية الأمونية الذائبة'),
        layerInfo(electric, 'نسبة التوصيل الكهربائي'),
        layerInfo(electricPOI, 'المناطق الملائمة والغير ملائمة للتوصيل الكهربائي'),
        layerInfo(suitableEli, 'أفضل اماكن للتوصيل الكهربائي'),
        layerInfo(iron, 'كمية الحديد الذائب'),
        layerInfo(nitrite, 'كمية النيتريت الذائب'),
        layerInfo(nitritePOI, 'المناطق الملائمة والغير ملائمة للنتريت'),
        layerInfo(oxygen, 'كمية الأوكسيجين الذائب'),
        layerInfo(ph, 'كمية الأس الهيدوجيني'),
        layerInfo(salinity, 'نسبة الملوحة'),
        layerInfo(salt, 'كمية الاملاح الكليه الذائبة'),
        layerInfo(temp, 'درجة الحرارة'),
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
        ammonia.visible = false,
        electric.visible = false,
        electricPOI.visible = false,
        suitableEli.visible = false,
        iron.visible = false,
        lake.visible = false,
        nitrite.visible = false,
        nitritePOI.visible = false,
        oxygen.visible = false,
        ph.visible = false,
        salinity.visible = false,
        salt.visible = false,
        temp.visible = false
}

view.when(() => {
    setTimeout(() => {
        disableLayers()
        lake.visible = true
        stations.visible = false
        setTimeout(() => {
            document.getElementById('loading').style.opacity = '0'
            setTimeout(() => {
                document.getElementById('loading').remove()
            }, 150);
        }, 500);
    }, 2000);
})



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

document.getElementById('nitritePOI').onclick = function () {
    if (!nitritePOI.visible) {
        disableLayers()
        nitritePOI.visible = true
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
    mapsMenuExpand.expanded = false
}
