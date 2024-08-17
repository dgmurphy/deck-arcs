import { useState } from 'react'
import DeckGL, {GeoJsonLayer, ArcLayer, TileLayer, BitmapLayer} from 'deck.gl'
import './App.css'
import LayerControls from './components/layer-controls'
import AppInit from './components/app-init'
import APP_C from './components/constants'

function App() {

  // APP STATE
  const [nodeScale, setNodeScale] = useState((APP_C.NODE_SCALE_MAX + APP_C.NODE_SCALE_MIN)/2.0);
  const [arcColorMode, setArcColorMode] = useState(APP_C.ARC_COLOR_BY_WAVEBAND)
  const [tileHost, setTileHost] = useState("NOT SET")
  const [mapStyle, setMapStyle] = useState("earth-data-viz")

  const TILESERVER_URL = tileHost + "/styles/" + mapStyle + "/{z}/{x}/{y}.png"

  const onClick = info => {
    if (info.object) {
      // eslint-disable-next-line
      alert(`${info.object.properties.name} Ruggedized: ${info.object.properties.ruggedized}`);
    }
  };

  function handleServerSelect(value) {
    setTileHost = value;
  }

  function handleUpdateNodeScale(value) {
    setNodeScale(value);
  }

  function nodeColor(ruggedized) {
    if (ruggedized) 
      return APP_C.RUGGEDIZED_COLOR
    else
      return APP_C.STANDARD_COLOR
  }

  function brighter(color) {
    let newColor = []
    color.forEach((c) => {
      let newC = c + (.5 * c)
      if (newC > 255)
        newC = 255
      newColor.push(newC)
    });

    return newColor
  }

  function arcColor(network, waveband, whichEnd) {
    let color = [100, 100, 100, 100]
    if (arcColorMode == APP_C.ARC_COLOR_BY_WAVEBAND)
      color = APP_C.WAVEBANDS[waveband]
    else
      color = APP_C.NETWORKS[network]

    if (whichEnd == "target")
      return brighter(color)
    else
      return color
  }

  function arcWidth(numPaths) {
    const MAXWIDTH = 10
    const MINWIDTH = 1

    let width = numPaths/2

    if (width < MINWIDTH)
      return 1
    else if (width > MAXWIDTH)
      return MAXWIDTH
    else
      return width

  }

  if (tileHost == "NOT SET") {
    return <AppInit handleUpdate={handleServerSelect}/>
  }

  return (
      <div>
        <div id="control-panel">
          <h2>Control Panel</h2>
          <LayerControls
            nodeScale={nodeScale}
            handleUpdate={handleUpdateNodeScale}
          />
        </div>
        <DeckGL controller={true} initialViewState={APP_C.INITIAL_VIEW_STATE}>
          <TileLayer
            id="base-map"
            data={TILESERVER_URL}
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
            id="arcs-standard"
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 0)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor(f.network, f.waveband, "source")}
            getTargetColor={f => arcColor(f.network, f.waveband, "target")}
            getWidth={f => arcWidth(f.numPaths)}
          />
          <ArcLayer
            id="arcs-rugged"
            data={APP_C.ARCS}
            dataTransform={d => d.features.filter(f => f.ruggedPath == 1)}
            getSourcePosition={f => f.sourcePosition}
            getTargetPosition={f => f.targetPosition}
            getSourceColor={f => arcColor(f.network, f.waveband, "source")}
            getTargetColor={f => arcColor(f.network, f.waveband, "target")}
            getWidth={f => arcWidth(f.numPaths)}
          />
        </DeckGL>
      </div>
    );
  }


export default App
