import { useContext } from 'react';
// import ChangeChannel from './ChangeChannel';
import LiveSearch from './LiveSearch';
import { roomContext } from '../providers/RoomProvider';

function View(props) {
  const { room } = useContext(roomContext)

  
  const hostURL = 'localhost' // Update this when deployed
  return (
    <div>
      Room Name: {room.name}
      {/* <ChangeChannel
        value={newChannel}
        onClick={handleChannel}
        onChange={(e) => setNewChannel(e.target.value)}
      /> */}
      <LiveSearch
      />
      <div>
        <iframe
          display='inline'
          src={`https://player.twitch.tv/?channel=${room.channel}&parent=${hostURL}`}
          height="480"
          width="69%"
          allowFullScreen
          title={room.name}>
        </iframe>
        <iframe
          display="inline"
          frameBorder="0"
          scrolling="no"
          src={`https://www.twitch.tv/embed/${room.channel}/chat?darkpopout&parent=${hostURL}`}
          height="480"
          width="30%"
          title={room.name}>
        </iframe>
      </div>
    </div>
  )
}

export default View;
