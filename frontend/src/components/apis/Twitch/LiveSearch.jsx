import React from "react";
import SearchBar from "./SearchBar";
import Results from "./Results";


export default function LiveSearch(props) {

  return (
    <div className='twitch-live-search'>  
        <SearchBar
        />
        <Results
        />
    </div>
  );
}