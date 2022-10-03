import ChangeChannel from './changeChannel';
import { useState } from 'react';
function Twitch(props) {
  const [newChannel, setNewChannel] = useState('');

  const handleChannel = function (e) {
    e.preventDefault();
    props.socket.emit('editRoom', { room: { ...props.room, channel: newChannel } });
    setNewChannel('');
  }
  
  return (
    <>
      <ChangeChannel
        value={newChannel}
        onClick={handleChannel}
        onChange={(e) => setNewChannel(e.target.value)}
      />
      <div>
        <iframe
          display='inline'
          src={`https://player.twitch.tv/?channel=${props.room.channel}&parent=localhost`}
          height="480"
          width="69%"
          allowFullScreen
          title={props.room.name}>
        </iframe>
        <iframe
          display="inline"
          frameBorder="0"
          scrolling="no"
          src={`https://www.twitch.tv/embed/${props.room.channel}/chat?darkpopout&parent=localhost`}
          height="480"
          width="30%"
          title={props.room.name}>
        </iframe>
      </div>
    </>
  )
}

export default Twitch;