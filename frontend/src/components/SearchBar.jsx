import React, { useState, useEffect, useCallback } from "react";

import useDebounce from "../hooks/useDebounce";
import "./SearchBar.scss";

export default function SearchBar(props) {
  // const [value, setValue] = useState("");
  const term = useDebounce(props.newChannel, 200);

  const onSearch = useCallback(props.setNewChannel, [term]);

  useEffect(() => {
    onSearch(term);
    props.setNewChannel(term);
  }, [term, onSearch]);

  return (
    <section className="search">
      <form className="search__form" onSubmit={event => event.preventDefault()}>
        <input
          className="radius"
          spellCheck="false"
          placeholder="Search Twitch Channels"
          name="search"
          type="text"
          value={props.newChannel}
          onChange={event => props.setNewChannel(event.target.value)}
        />
      </form>
    </section>
  );
}
