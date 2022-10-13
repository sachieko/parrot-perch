import Alert from "./Alert";

function Join (props) {

  return (
    <form className="root-inputs">
      <label>
      ❈Create or Join a Room❈
      </label>
        <input className='radius' placeholder="Enter Room Name" autoComplete="off" type="text" name="roomName" value={props.value} onChange={props.onChange} />
      <label>
      </label>
      <input className="radius" autoComplete="off" placeholder='Enter Password' type="password" name="roomPassword" value={props.value2} onChange={props.onChange2} />
      <input className="radius" type="submit" value="Submit" onClick={props.onClick} />
      { props.alert === 'bad password' && <Alert message={`That room's commandeered with a password which you need to board, matey!`} color='red'/>}
    </form>
  )
};

export default Join;
