import { useContext } from 'react';
import LiveSearch from "./LiveSearch";
import './Twitch.scss';
import { roomContext } from '../../../providers/RoomProvider';

function Twitch() {
  const { room } = useContext(roomContext);
  const hostURL = 'localhost' // Update this when deployed

  return (
    <div className='widget twitch-widget'>
      <LiveSearch />
      { room.channel && (
      <div className='stream-frames'>
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
      )}
    </div>
  )
}

export default Twitch;