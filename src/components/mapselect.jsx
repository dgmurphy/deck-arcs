export default function MapSelect({mapserver, handleUpdate}) {
  
  function handleMapStyle(e) {
    handleUpdate(e.target.value)
  }
  
  return (

    <div className="mapselect">
      Map server: {mapserver}

      <div style={{marginTop: "4px"}}>
        <div className="dropdown">
            <label style={{marginRight: "3px"}}> Map Style: </label>
            <select id="mapstyle" name="mapstyle" defaultValue={"plain"}
                    onChange={handleMapStyle}>
              <option value="earth-data-viz">Clean</option>
              <option value="natural-earth-extended">Shaded</option>
            </select>
        </div>
        <div className="dropdown">
            <label style={{marginRight: "3px"}}>Node Color: </label>
            <select id="nodecolor" name="nodecolor" disabled={true}>
              <option value="earth-data-viz">Ruggedized</option>
            </select>
        </div>
      </div>
    </div>
  );
}
