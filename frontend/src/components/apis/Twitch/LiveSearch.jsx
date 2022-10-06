import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import Results from "./Results";
import { roomContext } from "../../../providers/RoomProvider";

export default function LiveSearch(props) {
 const { searchResults } = useContext(roomContext);
  return (
    <div className='twitch-live-search'>  
        <SearchBar />
        { searchResults.length > 0 && (
          <div classname='twitch-search-results'>
        <Results />
        </div>
        )}
    </div>
  );
}