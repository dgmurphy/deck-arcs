import { useState, useEffect } from 'react'
import DeckGL, {GeoJsonLayer, ArcLayer, TileLayer, BitmapLayer} from 'deck.gl'
import './App.css'
import LayerControls from './components/layer-controls'
import MapSelect from './components/mapselect'
import PickInfo from './components/pickinfo'
import AppHeader from './components/appheader'
import APP_C from './components/constants'

function App() {

  // APP STATE
  const [nodeScale, setNodeScale] = useState((APP_C.NODE_SCALE_MAX + APP_C.NODE_SCALE_MIN)/2.0);
  const [stdArcOpacity, setStdArcOpacity] = useState(50)
  const [ruggedArcOpacity, setRuggedArcOpacity] = useState(50)
  const [arcWidthScale, setArcWidthScale] = useState(0.2)
  const [arcColorMode, setArcColorMode] = useState(APP_C.ARC_COLOR_BY_WAVEBAND)
  const [tileHost, setTileHost] = useState("http://localhost:8080")
  const [mapStyle, setMapStyle] = useState("earth-data-viz")
  const [pickInfo, setPickInfo] = useState({"init": true})
  const [arcFilterRange, setArcFilterRange] = useState([0, 10])


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

  function handleUpdateArcRange(value) {
    setArcFilterRange(value)
  }

  function handleUpdateNodeScale(value) {
    setNodeScale(value)
  }

  function handleUpdateArcScale(value) {
    setArcWidthScale(value)
  }

  function handleUpdateStdArcOpacity(value) {
    setStdArcOpacity(value)
  }

  function handleUpdateRuggedArcOpacity(value) {
    setRuggedArcOpacity(value)
  }

  function nodeColor(ruggedized) {
    if (ruggedized) 
      return APP_C.RUGGEDIZED_COLOR
    else
      return APP_C.STANDARD_COLOR
  }


  function brighter(color) {
    
    let newc = [0,0,0,color[3]]

    for (let i = 0; i < 3; i++) {
      newc[i] = color[i] + 150
      if (newc[i] > 255)
        newc[i] = 255
    }
    return newc
  }

  
  function arcColor(type, waveband, numPaths, whichEnd) {

    let color = APP_C.WAVEBANDS[waveband]
    if (!color)
      color = [0, 0, 0, 255]

 
    // if (whichEnd == "source")
    //   color =  brighter(color)

    // Hide arcs that do not pass the path weight filter
    let lineWeight = arcWidth(numPaths)
    let opacity

    if ((lineWeight < arcFilterRange[0]) || (lineWeight > arcFilterRange[1])) {
           opacity = 0
    } else {
         if (type == "std")
           opacity = stdArcOpacity
         else
           opacity = ruggedArcOpacity
    }    
    
    // set 0-255 value
    if (opacity > 0) {
      opacity = Math.floor(opacity/100 * 255)
    }

    color[3] = opacity

    return color
    
  }


  function arcWidth(numPaths) {

    let width = numPaths

    if (width < 1)
      return 1
    else if (width > APP_C.ARC_WIDTH_MAX)
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
          <AppHeader/>
          <hr className="hrule" />
          <LayerControls
            nodeScale={nodeScale}
            handleUpdateNodeScale={handleUpdateNodeScale}
            stdArcOpacity={stdArcOpacity}
            handleUpdateStdArcOpacity={handleUpdateStdArcOpacity}
            ruggedArcOpacity={ruggedArcOpacity}
            handleUpdateRuggedArcOpacity={handleUpdateRuggedArcOpacity}
            arcWidthScale={arcWidthScale}
            handleUpdateArcScale={handleUpdateArcScale}
            arcFilterRange={arcFilterRange}
            handleUpdateArcRange={handleUpdateArcRange}
          />
          <MapSelect 
            mapserver={tileHost}
            handleUpdate={handleUpdateMapStyle}
          />
          <hr className="hrule" />
          <PickInfo entityInfo={pickInfo} />
        </div>
        <DeckGL 
          controller={true} 
          initialViewState={APP_C.INITIAL_VIEW_STATE}
          getCursor={() => "crosshair"}
          useDevicePixels={false}
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
            parameters={{depthTest: false}}
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 1)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor("rugged", f.waveband, f.numPaths, "source")}
            getTargetColor={f => arcColor("rugged", f.waveband, f.numPaths, "target")}
            getWidth={f => arcWidth(f.numPaths)}
            visible={ruggedArcOpacity > .1 ? true : false}
            widthScale={arcWidthScale}
            updateTriggers={{getSourceColor:[ruggedArcOpacity, arcFilterRange],
                             getTargetColor:[ruggedArcOpacity, arcFilterRange]}}
          />

          <ArcLayer
            id="arcs-standard"
            parameters={{depthTest: false}}
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 0)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor("std", f.waveband, f.numPaths, "source")}
            getTargetColor={f => arcColor("std", f.waveband, f.numPaths, "target")}
            getWidth={f => arcWidth(f.numPaths)}
            visible={stdArcOpacity > .1 ? true : false}
            widthScale={arcWidthScale}
            updateTriggers={{getSourceColor:[stdArcOpacity, arcFilterRange],
                             getTargetColor:[stdArcOpacity, arcFilterRange]}}
          />

        </DeckGL>
      </div>
    );
  }


export default App
