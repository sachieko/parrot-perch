function JoinRoom(props) {
  return (
    <form>
      <label>
        Join Room:
        <input type="text" name="roomName" value={props.value} onChange={props.onChange} />
      </label>
      <input type="submit" value="Submit" onClick={props.onClick} />
    </form>
  )
}

export default JoinRoom;