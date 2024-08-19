
import { Slider } from "@blueprintjs/core"
 
export default function LayerControls({nodeScale, handleUpdateNodeScale, 
  stdArcOpacity, handleUpdateStdArcOpacity,
  ruggedArcOpacity, handleUpdateRuggedArcOpacity,
  arcWidthScale, handleUpdateArcScale}) {
    return (

      <div className="sliders">
        <div className="sliderAndLabel">
          <div className="nodeScaleLabel" title="node scale"></div>
          <div className="slider-control">
            <Slider
              min={1000}
              max={20000}
              value={nodeScale}
              onChange={handleUpdateNodeScale}
              stepSize={500}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>

        <div className="sliderAndLabel">
          <div className="standardArcOpacityLabel" title="arc opacity"></div>
          <div className="slider-control">
            <Slider
              min={0}
              max={100}
              value={stdArcOpacity}
              onChange={handleUpdateStdArcOpacity}
              stepSize={1}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>

        <div className="sliderAndLabel">
          <div className="ruggedArcOpacityLabel" title="rugged arc opacity"></div>
          <div className="slider-control">
            <Slider
              min={0}
              max={100}
              value={ruggedArcOpacity}
              onChange={handleUpdateRuggedArcOpacity}
              stepSize={1}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>

        <div className="sliderAndLabel">
          <div className="arcWidthLabel" title="arc scale"></div>
          <div className="slider-control">
            <Slider
              min={0.01}
              max={1}
              value={arcWidthScale}
              onChange={handleUpdateArcScale}
              stepSize={.01}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>

        <div className="sliderAndLabel">
          <div className="arcFilterLabel" title="arc filter"></div>
          <div className="slider-control">
            <Slider
              min={0.01}
              max={1}
              value={arcWidthScale}
              onChange={<></>}
              stepSize={.01}
              labelRenderer={false}
              vertical={false}
            />
          </div>
        </div>

      </div>

    );
  }
  