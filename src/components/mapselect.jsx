export default function MapSelect({mapserver, handleUpdate}) {
  
  function handleMapStyle(e) {
    handleUpdate(e.target.value)
  }
  
  return (

    <div className="mapselect">
      Map server: {mapserver}

      <div style={{marginTop: "4px"}}>
        <label style={{marginRight: "3px"}}>
          Map Style: </label>
          <select id="mapstyle" name="mapstyle" defaultValue={"plain"}
                  onChange={handleMapStyle}>
            <option value="earth-data-viz">Plain</option>
            <option value="natural-earth-extended">Shaded</option>
          </select>
        
      </div>
    </div>

  );
}
