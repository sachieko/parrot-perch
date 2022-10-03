import { useState } from 'react';
import ChangeChannel from './changeChannel';

function ViewRoom(props) {
  const [channel, setChannel] = useState('')

  const handleChannel = function (e) {
    e.preventDefault()
    props.socket.emit('attachChannelToRoom', { roomName: props.room, channel: channel })
    setChannel('')
  }

  return (
    <div>
      Room Name: {props.room}
      <ChangeChannel
        value={channel}
        onClick={handleChannel}
        onChange={(e) => setChannel(e.target.value)}
      />
      <div>
        <iframe
          display='inline'
          src={`https://player.twitch.tv/?channel=${props.channel}&parent=localhost`}
          height="480"
          width="69%"
          allowFullScreen
          title={props.room}>
        </iframe>
        <iframe
          display="inline"
          frameBorder="0"
          scrolling="no"
          src={`https://www.twitch.tv/embed/${props.channel}/chat?darkpopout&parent=localhost`}
          height="480"
          width="30%">
        </iframe>
      </div>
    </div>
  )
}

export default ViewRoom;