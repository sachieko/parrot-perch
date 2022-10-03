import React, { useState, useEffect, useCallback } from "react";

import useDebounce from "../hooks/useDebounce";
import "./SearchBar.scss";

export default function SearchBar(props) {
  const [value, setValue] = useState("");
  const term = useDebounce(value, 200);

  const onSearch = useCallback(props.onSearch, [term]);

  useEffect(() => {
    onSearch(term);
  }, [term, onSearch]);

  return (
    <section className="search">
      <form className="search__form" onSubmit={event => event.preventDefault()}>
        <input
          className="radius"
          spellCheck="false"
          placeholder="Search Channels"
          name="search"
          type="text"
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </section>
  );
}
