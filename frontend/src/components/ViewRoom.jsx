import { useContext, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { roomContext } from '../providers/RoomProvider';
import Youtube from './apis/Youtube';
import Twitch from './apis/Twitch';
import Chat from './Chat';
import Whiteboard from './whiteboard';


function View() {
  const { room } = useContext(roomContext);
  const [widgetSwitches, setWidgetSwitches] = useState(
    [{ name: 'Twitch', selected: true },
    { name: 'Youtube', selected: true },
    { name: 'Chat', selected: true },
    { name: 'Whiteboard', selected: true }]);

  const selectSwitch = (i) => {
    setWidgetSwitches((oldSwitches) => {
      const selectingSwitch = { ...oldSwitches[i], selected: !oldSwitches[i].selected };
      const newSwitches = [...oldSwitches];
      newSwitches[i] = selectingSwitch;
      return newSwitches;
    });
  }

  const addclass=()=>{
    document.querySelector(".mb-2").classList.toggle('selected');
} 

  const showSwitches = widgetSwitches.map((switcher, i) => {
    const addclass=()=>{
      document.querySelector(`[for|=button-${switcher.name}]`).classList.toggle('selected');
  } 

    return <ToggleButton
      className="mb-2"
      id={`button-${switcher.name}`}
      type="checkbox"
      variant="outline-secondary"
      checked={switcher.selected}
      value="1"
      onClick={() => {
        selectSwitch(i)
        addclass()}}
      key={i}
    >
      {switcher.name}
    </ToggleButton>
  });

  return (
    <>
      Room Name: {room.name}
      {widgetSwitches[3].selected && <Whiteboard />}

      <div className='widget-container'>
        <div className="nav-toggle">
          {showSwitches}
        </div>
        {widgetSwitches[0].selected && <Twitch />}
        {widgetSwitches[1].selected && <Youtube />}
        {widgetSwitches[2].selected && <Chat />}
      </div>
    </>
  );
};

export default View;
