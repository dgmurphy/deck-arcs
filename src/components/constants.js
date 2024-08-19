const APP_C = {
    ARC_COLOR_BY_WAVEBAND: "arc_color_by_waveband",
    ARC_COLOR_BY_NETWORK: "arc_color_by_network",
    NODE_SCALE_MAX: 10000,
    NODE_SCALE_MIN: 1000,
    NETWORKS: { 
        "AlphaNet": [200,90,80,255], 
        "BravoNet": [90,200,80,255],
        "CharlieNet": [90,90,200,255],
        "DeltaNet": [100,100,80,255],
    },
    WAVEBANDS: { 
        "AHF": [255,183,0,255], 
        "BHF": [82,173,36,255],
        "CHF": [41,207,157,255],
        "DHF": [41,185,207,255],
        "FHF": [41, 96, 207, 255]
    },
    NODES: '/nodes.geojson',
    ARCS: '/arcs.geojson',
    INITIAL_VIEW_STATE: {
        longitude: -80,
        latitude: 38,
        zoom: 2,
        maxZoom: 20,
        pitch: 50,
        bearing: 0
    },
    RUGGEDIZED_COLOR: [50, 180, 50, 180],
    STANDARD_COLOR: [90, 90, 255, 180],
    TILEHOST_DEFAULTS: [
        "http://localhost:8080", 
        "https://wb-mindockweb.usgovvirginia.cloudapp.usgovcloudapi.net:20443"
    ],
    MAPSTYLE_DEFAULTS: ["earth-data-viz", "natural-earth-extended"]
    
}

export default APP_C