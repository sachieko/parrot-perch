import { useContext } from 'react';
// import ChangeChannel from './ChangeChannel';
import Youtube from './apis/Youtube';
import Twitch from './apis/twitch'
import { roomContext } from '../providers/RoomProvider';
import { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Chat from './Chat';


function View(props) {
  const { room } = useContext(roomContext);
  const [widgetSwitches, setWidgetSwitches] = useState(
    [{ name: 'twitch', selected: false },
    { name: 'youtube', selected: true },
    { name: 'chat', selected: false }]);

  const selectSwitch = (i) => {
    setWidgetSwitches((oldSwitches) => {
      const selectingSwitch = { ...oldSwitches[i], selected: !oldSwitches[i].selected };
      const newSwitches = [...oldSwitches];
      newSwitches[i] = selectingSwitch;
      return newSwitches;
    });
  }

  const showSwitches = widgetSwitches.map((switcher, i) => {
    return <ToggleButton
      className="mb-2"
      id="toggle-check"
      type="checkbox"
      variant="outline-primary"
      checked={switcher.selected}
      value="1"
      onClick={() => selectSwitch(i)}
      key={i}
    >
      {switcher.name}
    </ToggleButton>
  });

  return (
    <div>
      Room Name: {room.name}
      {showSwitches}
      {widgetSwitches[0].selected && <Twitch />}
      {widgetSwitches[1].selected && <Youtube />}
      {widgetSwitches[2].selected && <Chat />}
    </div>
  );
};

export default View;
