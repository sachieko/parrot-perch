import React from "react";

import "./Channel.scss";

export default function Channel(props) {
  const url = `http://www.twitch.tv/${props.display_name}`

  return (
    <article className="streamer-channel" onClick={event =>  window.location.href=url}>
      <img className="thumbnail" src={props.thumbnail_url} alt="Channel" />
      <div className="names">
        <div className="display_name">{props.display_name}</div>
        <div className="game_name">{props.game_name}</div>
      </div>
    </article>
  );
}
