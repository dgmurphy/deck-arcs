
import { Slider } from "@blueprintjs/core"


export default function LayerControls({nodeScale, handleUpdate}) {
    return (

      <div>
        <div className="slider-control">
          <div className="sliders-row">

            <div className='cem-slider'>  
              <div className="bp-slider">
                <Slider
                  min={1000}
                  max={10000}
                  value={nodeScale}
                  onChange={handleUpdate}
                  stepSize={500}
                  labelRenderer={false}
                  vertical={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
  