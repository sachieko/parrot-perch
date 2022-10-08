import React, { useContext } from "react";
import { roomContext } from "../../../providers/RoomProvider";
import Channel from "./Channel";


export default function Results(props) {
  const { socket, setNewChannel, room, searchResults } = useContext(roomContext)
  
  const handleChannel = function (e, streamerName) {
    e.preventDefault();
    socket.emit('editRoom', { room: { ...room, channel: streamerName } });
    setNewChannel('');
  };
  const channelList = searchResults.map(stream => {
    return (
    
    <Channel key={stream.id} {...stream} 
      handleChannel={handleChannel}
    />
    );
  });

  return (
    <div className='result-list'> 
    {channelList}
    </div>
  )
};
