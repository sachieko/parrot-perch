function Join (props) {

  console.log(props)
  return (
    <main>
    <form>
      <label>
        Join Room:
        <input type="text" name="roomName" value={props.value} onChange={props.onChange} />
      </label>
      <label>
        Password?
      <input type="password" name="roomPassword" value={props.value2} onChange={props.onChange2} />
      </label>
      <input type="submit" value="Submit" onClick={props.onClick} />
    </form>
    </main>
  )
}

export default Join;
