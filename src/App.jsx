import { useState } from 'react'
import DeckGL, {GeoJsonLayer, ArcLayer, TileLayer, BitmapLayer} from 'deck.gl';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import LayerControls from './components/layer-controls';

function App() {
  const NODE_SCALE_MAX = 10000
  const NODE_SCALE_MIN = 1000
  const [nodeScale, setNodeScale] = useState((NODE_SCALE_MAX + NODE_SCALE_MIN)/2.0);

  const NODES =
    '/nodes.geojson';

  const INITIAL_VIEW_STATE = {
    longitude: -100,
    latitude: 38,
    zoom: 3,
    maxZoom: 20,
    pitch: 50,
    bearing: 0
  };

  const TILEHOST = "http://localhost:8080"
  const MAPSTYLE = "earth-data-viz" // natural-earth-extended
  const TILESERVER_URL = TILEHOST + "/styles/" + MAPSTYLE + "/{z}/{x}/{y}.png"

  const RUGGEDIZED_COLOR = [50, 180, 50, 180]
  const STANDARD_COLOR = [90, 90, 255, 180]

  const onClick = info => {
    if (info.object) {
      // eslint-disable-next-line
      alert(`${info.object.properties.name} Ruggedized: ${info.object.properties.ruggedized}`);
    }
  };

  function handleUpdateNodeScale(value) {
    setNodeScale(value);
  }

  function nodeColor(ruggedized) {
    if (ruggedized) 
      return RUGGEDIZED_COLOR
    else
      return STANDARD_COLOR
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
      <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE}>
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
          data={NODES}
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
          id="arcs"
          data={NODES}
          dataTransform={d => d.features}
          getSourcePosition={f => [-0.4531566, 51.4709959]}
          getTargetPosition={f => f.geometry.coordinates}
          getSourceColor={[0, 128, 200]}
          getTargetColor={[200, 0, 80]}
          getWidth={1}
        />
      </DeckGL>
    </div>
  );
}

export default App
