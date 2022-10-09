function Join (props) {

  return (
    <form className="root-inputs">
      <label>
        Join Room:
      </label>
        <input className='radius' type="text" name="roomName" value={props.value} onChange={props.onChange} />
      <label>
        Password:
      </label>
      <input className="radius" type="password" name="roomPassword" value={props.value2} onChange={props.onChange2} />
      <input className="radius" type="submit" value="Submit" onClick={props.onClick} />
    </form>
  )
}

export default Join;
