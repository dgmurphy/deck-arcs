const APP_C = {
    NODE_SCALE_MAX: 20000,
    NODE_SCALE_MIN: 1000,
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
    MAPSTYLE_DEFAULTS: ["earth-data-viz", "natural-earth-extended"],
    ARC_WIDTH_MAX: 30
    
}

export default APP_C