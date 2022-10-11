import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import Results from "./Results";
import { roomContext } from "../../../providers/RoomProvider";

export default function LiveSearch(props) {
 const { searchResults, newChannel } = useContext(roomContext);
  return (
    <div className='twitch-live-search'>  
        <SearchBar />
        {searchResults.length > 0 && newChannel && (
        <Results />
        )}
    </div>
  );
}