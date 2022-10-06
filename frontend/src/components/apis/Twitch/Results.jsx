import React, { useContext } from "react";
import { roomContext } from "../../../providers/RoomProvider";
import Channel from "./Channel";


export default function Results(props) {
  const { socket, setNewChannel, room, searchResults } = useContext(roomContext)
  
  const handleChannel = function (e, streamerName) {
    e.preventDefault();
    socket.emit('editRoom', { room: { ...room, channel: streamerName } });
    setNewChannel('');
    // console.log("handleChannel was triggered");
    // console.log(streamerName);
  };
  return searchResults.map(stream => {
    return (
    <div className='result-list'> 
    <Channel key={stream.id} {...stream} 
      handleChannel={handleChannel}
    />
    </div>
    );
  });
}
