import { useState, useEffect } from 'react'
import DeckGL, {GeoJsonLayer, ArcLayer, TileLayer, BitmapLayer} from 'deck.gl'
import './App.css'
import LayerControls from './components/layer-controls'
import MapSelect from './components/mapselect'
import PickInfo from './components/pickinfo'
import APP_C from './components/constants'

function App() {

  // APP STATE
  const [nodeScale, setNodeScale] = useState((APP_C.NODE_SCALE_MAX + APP_C.NODE_SCALE_MIN)/2.0);
  const [stdArcOpacity, setStdArcOpacity] = useState(50)
  const [ruggedArcOpacity, setRuggedArcOpacity] = useState(50)
  const [arcWidthScale, setArcWidthScale] = useState(0.5)
  const [arcColorMode, setArcColorMode] = useState(APP_C.ARC_COLOR_BY_WAVEBAND)
  const [tileHost, setTileHost] = useState("http://localhost:8080")
  const [mapStyle, setMapStyle] = useState("earth-data-viz")
  const [pickInfo, setPickInfo] = useState({"init": true})


  // Load map server config
  useEffect(() => {
    let ignore = false;
    fetch('mapserver.json')
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setTileHost(json["mapserver_url"])
        }
      });
    return () => {
      ignore = true;
    };
  });  


  function onClick(info) {

    setPickInfo({
      init: false,
      name: info.object.properties.name,
      coordinates: info.object.geometry.coordinates,
      ruggedized: info.object.properties.ruggedized,
      score: info.object.properties.score,
      url: info.object.properties.url
    })

    const pickerXform = [
      { transform: "scale(2)", backgroundColor: "purple" },
      { transform: "scale(0.9)", backgroundColor: "aqua" },
      { transform: "scale(1)", backgroundColor: "grey" },
    ];
  
    const pickerTiming = {
      duration: 300,
      iterations: 1,
    };
  
    const picker = document.getElementById("pulse")
    if (picker) {
      picker.animate(pickerXform, pickerTiming)
    }
  
  }


  function handleUpdateNodeScale(value) {
    setNodeScale(value);
  }

  function handleUpdateArcScale(value) {
    setArcWidthScale(value);
  }

  function handleUpdateStdArcOpacity(value) {
    setStdArcOpacity(value);
  }

  function handleUpdateRuggedArcOpacity(value) {
    setRuggedArcOpacity(value);
  }

  function nodeColor(ruggedized) {
    if (ruggedized) 
      return APP_C.RUGGEDIZED_COLOR
    else
      return APP_C.STANDARD_COLOR
  }


  function brighter(color, opacity) {
    let newColor = []
    color.forEach((c) => {
      let newC = c + (.5 * c)
      if (newC > 255)
        newC = 255
      newColor.push(newC)
    });

    newColor[3] = opacity
    console.log(newColor)
    return newColor
  }


  function arcColor(type, network, waveband, whichEnd) {
    let color 
    if (arcColorMode == APP_C.ARC_COLOR_BY_WAVEBAND)
      color = APP_C.WAVEBANDS[waveband]
    else
      color = APP_C.NETWORKS[network]

    let opacity = stdArcOpacity
    if (type == "rugged")
      opacity = ruggedArcOpacity

    color[3] = Math.floor((opacity/100) * 255)

    if (whichEnd == "target")
      color =  brighter(color, opacity)

    return color
  }


  function arcWidth(numPaths) {
    const MAXWIDTH = 10
    const MINWIDTH = 1

    let width = numPaths

    if (width < MINWIDTH)
      return 1
    else if (width > MAXWIDTH)
      return MAXWIDTH
    else
      return width

  }


  function handleUpdateMapStyle(mstyle) {
    setMapStyle(mstyle)
  }

 
  return (
      <div>
        <div className="controls" id="control-panel">
          <p className="apptitle">NIE Geo</p>
          <hr className="hrule" />
          <MapSelect 
            mapserver={tileHost}
            handleUpdate={handleUpdateMapStyle}
          />
          <LayerControls
            nodeScale={nodeScale}
            handleUpdateNodeScale={handleUpdateNodeScale}
            stdArcOpacity={stdArcOpacity}
            handleUpdateStdArcOpacity={handleUpdateStdArcOpacity}
            ruggedArcOpacity={ruggedArcOpacity}
            handleUpdateRuggedArcOpacity={handleUpdateRuggedArcOpacity}
            arcWidthScale={arcWidthScale}
            handleUpdateArcScale={handleUpdateArcScale}
          />
          <hr className="hrule" />
          <PickInfo entityInfo={pickInfo} />
        </div>
        <DeckGL 
          controller={true} 
          initialViewState={APP_C.INITIAL_VIEW_STATE}
          getCursor={() => "crosshair"}
          >
          <TileLayer
            id="base-map"
            data={tileHost + "/styles/" + mapStyle + "/{z}/{x}/{y}.png"}
            maxZoom={19}
            minZoom={0}
            pickable= {true}
            renderSubLayers= {
              props => {
                const {boundingBox} = props.tile;
            
                return new BitmapLayer(props, {
                  data: null,
                  image: props.data,
                  bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
                });
              }
            }
          />
          <GeoJsonLayer
            id="nodes"
            data={APP_C.NODES}
            filled={true}
            pointRadiusMinPixels={2}
            pointRadiusScale={nodeScale}
            getPointRadius={f => 11 - f.properties.score}
            getFillColor={f => nodeColor(f.properties.ruggedized)}
            pickable={true}
            autoHighlight={true}
            onClick={onClick}
          />

          <ArcLayer
            id="arcs-rugged"
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 1)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor("rugged", f.network, f.waveband, "source")}
            getTargetColor={f => arcColor("rugged", f.network, f.waveband, "target")}
            getWidth={f => arcWidth(f.numPaths)}
            visible={ruggedArcOpacity > 1 ? true : false}
            widthScale={arcWidthScale}
            updateTriggers={{getSourceColor:[ruggedArcOpacity]}}
          />

          <ArcLayer
            id="arcs-standard"
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 0)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor("std", f.network, f.waveband, "source")}
            getTargetColor={f => arcColor("std", f.network, f.waveband, "target")}
            getWidth={f => arcWidth(f.numPaths)}
            visible={stdArcOpacity > 1 ? true : false}
            widthScale={arcWidthScale}
            updateTriggers={{getSourceColor:[stdArcOpacity]}}
          />

        </DeckGL>
      </div>
    );
  }


export default App
