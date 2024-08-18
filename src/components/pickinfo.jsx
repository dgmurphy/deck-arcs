export default function PickInfo(entityInfo) {

  let einfo = entityInfo.entityInfo

  console.log(einfo.name)

  return (

    <div className="pickinfo">
      <div className="pickheading">
        <div className="pickdot" id="pulse"></div>
        <div className="eprops">Entity Properties:</div> 
      </div>
      <div className="proplist">
        <p><span className="proplabel">Name:</span>{einfo.name}</p>
        <p><span className="proplabel">Property:</span></p>
      </div>
    </div>
  )
}
