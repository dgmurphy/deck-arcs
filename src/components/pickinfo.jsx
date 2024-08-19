export default function PickInfo(entityInfo) {

  let einfo = entityInfo.entityInfo

  if(einfo.init) {
    return (
      <div className="pickinfo">
      <div className="pickheading">
        <div className="pickdot" id="pulse"></div>
        <div className="eprops">Entity Properties:</div> 
      </div>
      <div className="proplist">
        <p><span className="proplabel">Click an entity...</span></p>
      </div>
      </div>    
    )
  }

  let ruggedized = 'No'
  if (einfo.ruggedized)
    ruggedized = 'Yes'

  let lat = einfo.coordinates[0].toFixed(6)
  let lon = einfo.coordinates[1].toFixed(6)

  console.log(einfo)

  return (

    <div className="pickinfo">
      <div className="pickheading">
        <div className="pickdot" id="pulse"></div>
        <div className="eprops">Entity Properties:</div> 
      </div>
      <div className="proplist">
        <p><span className="proplabel">Name:</span>{einfo.name}</p>
        <p><span className="proplabel">Loc:</span>
          <span className="latlong">({lat}, {lon})</span></p>
        <p><span className="proplabel">Ruggedized:</span>{ruggedized}</p>
        <p><span className="proplabel">Score:</span>{einfo.score}</p>
        <p><span className="proplabel">Link:</span>
        <a href={einfo.url} target="_blank">{einfo.name}</a></p>              
      </div>
    </div>
  )
}
