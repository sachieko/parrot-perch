import React from "react";

export default function Channel(props) {
 
  return (
    <article className="album">
      <img className="album__thumbnail" src={props.thumbnail_url} alt="Channel" />
      <div className='random'>
        <div className="album__name">{props.display_name}</div>
        <div className="album__artist">{props.game_name}</div>
      </div>
    </article>
  );
}
