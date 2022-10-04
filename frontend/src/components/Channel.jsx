import React from "react";

import "./Channel.scss";

export default function Channel(props) {

  return (
    <article className="streamer-channel" onClick={e => props.handleChannel(e, props.display_name)}>
      <img className="thumbnail" src={props.thumbnail_url} alt="Channel" />
      <div className="names">
        <div className="display_name">{props.display_name} {props.is_live && <div>Live</div>}</div>
        <div className="game_name">{props.game_name}</div>
      </div>
    </article>
  );
}
