import Login from "./Login";
import Dashboard from "./Dashboard";

function Spotify(props) {
  return (
    <>
      <p>Spotify</p>
      {props.code ? <Dashboard code={props.code} /> : <Login />}
    </>
  )
}

export default Spotify;