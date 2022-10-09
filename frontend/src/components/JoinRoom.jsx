function Join (props) {

  return (
    <form>
      <label>
        Join Room:
      </label>
        <input type="text" name="roomName" value={props.value} onChange={props.onChange} />
      <label>
        Password:
      </label>
      <input type="password" name="roomPassword" value={props.value2} onChange={props.onChange2} />
      <input type="submit" value="Submit" onClick={props.onClick} />
    </form>
  )
}

export default Join;
