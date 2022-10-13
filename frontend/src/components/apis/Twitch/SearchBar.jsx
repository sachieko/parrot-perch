import { useContext } from "react";
import "./SearchBar.scss";
import { roomContext } from '../../../providers/RoomProvider';

export default function SearchBar(props) {
  const { newChannel, setNewChannel } = useContext(roomContext);

  return (
      <form className="search__form" onSubmit={event => event.preventDefault()}>
        <input
          className="radius"
          spellCheck="false"
          placeholder="Search Twitch Channels"
          name="search"
          type="text"
          value={newChannel}
          onChange={event =>setNewChannel(event.target.value)}
        />
      </form>
  );
};
