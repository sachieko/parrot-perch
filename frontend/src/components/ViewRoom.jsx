import { useContext } from 'react';
// import ChangeChannel from './ChangeChannel';
import Youtube from './apis/Youtube';
import Twitch from './apis/twitch/Twitch'
import { roomContext } from '../providers/RoomProvider';
import { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';


function View(props) {
  const { room } = useContext(roomContext);
  const [apis, setApis] = useState(
    [{ name: 'twitch', selected: false },
    { name: 'youtube', selected: true }]);

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
      Room Name: {room.name}
      {apiSwitches}
      {apis[0].selected && <Twitch />}
      {apis[1].selected && <Youtube />}
    </div>
  );
};

export default View;
