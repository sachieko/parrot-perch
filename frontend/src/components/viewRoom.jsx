import { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Twitch from './apis/Twitch';
import Spotify from './apis/spotify/Spotify';

function ViewRoom(props) {
  const [apis, setApis] = useState(
    [{ name: 'twitch', selected: false },
    { name: 'spotify', selected: true }]);

  const code = new URLSearchParams(window.location.search).get("code");

  const selectApi = (i) => {
    setApis((oldApis) => {
      const selectingApi = { ...oldApis[i], selected: !oldApis[i].selected };
      const newApis = [...oldApis];
      newApis[i] = selectingApi;
      return newApis;
    });
  }

  const apiSwitches = apis.map((api, i) => {
    return <ToggleButton
      className="mb-2"
      id="toggle-check"
      type="checkbox"
      variant="outline-primary"
      checked={api.selected}
      value="1"
      onClick={() => selectApi(i)}
      key={i}
    >
      {api.name}
    </ToggleButton>
  });

  return (
    <div>
      Room Name: {props.room.name}
      {apiSwitches}
      {apis[0].selected && <Twitch room={props.room} socket={props.socket} />}
      {apis[1].selected && <Spotify code={code} />}
    </div>
  )
}

export default ViewRoom;