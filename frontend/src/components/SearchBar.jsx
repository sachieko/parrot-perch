import { useContext } from "react";
import "./SearchBar.scss";
import { roomContext } from '../providers/RoomProvider';

export default function SearchBar(props) {
  const { searchValue, setSearchValue } = useContext(roomContext);

  return (
    <section className="search">
      <form className="search__form" onSubmit={event => event.preventDefault()}>
        <input
          className="radius"
          spellCheck="false"
          placeholder="Search Channels"
          name="search"
          type="text"
          value={searchValue}
          onChange={event => setSearchValue(event.target.value)}
        />
      </form>
    </section>
  );
}
