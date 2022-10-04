import { useState } from 'react';
import ChangeChannel from './ChangeChannel';
import LiveSearch from './LiveSearch';

function View(props) {
  const [newChannel, setNewChannel] = useState('');

  const handleChannel = function (e, streamerName) {
    e.preventDefault();
    props.socket.emit('editRoom', { room: { ...props.room, channel: streamerName } });
    setNewChannel('');
    console.log("handleChannel was triggered")
    // console.log(streamerName);
  }

  return (
    <div>
      Room Name: {props.room.name}
      {/* <ChangeChannel
        value={newChannel}
        onClick={handleChannel}
        onChange={(e) => setNewChannel(e.target.value)}
      /> */}
      <LiveSearch
        setNewChannel={setNewChannel}
        handleChannel={handleChannel}
        newChannel={newChannel}
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
    </div>
  )
}

export default View;
