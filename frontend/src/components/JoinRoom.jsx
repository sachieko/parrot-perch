import RoomPassword from "./RoomPassword";

function Join (props) {
  return (
    <main>
    <form>
      <label>
        Join Room:
        <input type="text" name="roomName" value={props.value} onChange={props.onChange} />
      </label>
      <input type="submit" value="Submit" onClick={props.onClick} />
    </form>
    <RoomPassword />
    </main>
  )
}

export default Join;
