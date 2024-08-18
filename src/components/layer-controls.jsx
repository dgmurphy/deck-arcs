
import { Slider } from "@blueprintjs/core"
 
export default function LayerControls({nodeScale, handleUpdate}) {
    return (

      <div className="sliders">
        <div className="sliderAndLabel">
          <div className="nodeScaleLabel" title="nodescale"></div>
          <div className="slider-control">
            <Slider
              min={1000}
              max={20000}
              value={nodeScale}
              onChange={handleUpdate}
              stepSize={500}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>
      </div>

    );
  }
  