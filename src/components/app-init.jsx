import APP_C from './constants'
import { Button } from "@blueprintjs/core"

export default function AppInit(handleUpdate) {


    function handleSubmit(e) {
        console.log("SUBMIT")
        
    }

    function handleInput(evt) {
        const val = evt.target.value;
        console.log(val)
    }

    return (

      <div>
        <h1> SETUP </h1>
        <input name="tileHost" 
               onChange={handleInput}
               style={{width: "600px"}}
               value={APP_C.TILEHOST_DEFAULTS[0]}/>
        <div style={{ marginTop: "20px" }}>
            <Button onClick={handleSubmit}>Go</Button>
            </div>
      </div>

    );
  }
  