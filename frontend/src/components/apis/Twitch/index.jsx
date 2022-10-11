import { useContext } from 'react';
import LiveSearch from "./LiveSearch";
import './Twitch.scss';
import { roomContext } from '../../../providers/RoomProvider';
import { useState } from 'react';

function Twitch() {
  const { room } = useContext(roomContext);
  const hostURL = 'localhost' // Update this when deployed
  const [viewChat, setViewChat] = useState(true);

  const minimize = (e) => {
    setViewChat(!viewChat);
  }

  return (
    <div className='twitch-widget'>
      <LiveSearch />
      {room.channel && (
        <div className='stream-frames'>
          <iframe
            className='twitch-video-frame'
            display='inline'
            src={`https://player.twitch.tv/?channel=${room.channel}&parent=${hostURL}`}
            height="480"
            allowFullScreen
            title={room.name}>
          </iframe>
          <div className='twitch-chat-container'>
          <button class="min-twitch-btn" onClick={minimize}>{viewChat ? <i class="fa-solid fa-window-minimize"></i> : <i class="fa-solid fa-plus"></i>}</button>
            {viewChat && (
                <iframe
                className='twitch-chat-frame'
                frameBorder="0"
                scrolling="no"
                src={`https://www.twitch.tv/embed/${room.channel}/chat?darkpopout&parent=${hostURL}`}
                height="480"
                title={room.name}>
              </iframe>)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Twitch;