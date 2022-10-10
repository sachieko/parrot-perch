function Join (props) {

  return (
    <form className="root-inputs">
      <label>
        -Create or Join a Room-
      </label>
        <input className='radius' placeholder="Enter Room Name" type="text" name="roomName" value={props.value} onChange={props.onChange} />
      <label>
      </label>
      <input className="radius" placeholder='Enter Password' type="password" name="roomPassword" value={props.value2} onChange={props.onChange2} />
      <input className="radius" type="submit" value="Submit" onClick={props.onClick} />
    </form>
  )
}

export default Join;
