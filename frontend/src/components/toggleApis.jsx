import { useState } from 'react';
import './toggleApis.css';
import ToggleButton from 'react-bootstrap/ToggleButton';

function ToggleApis() {
  const [selected, setSelected] = useState(true);
  return (
    <div>
      <ToggleButton
        className="mb-2"
        id="toggle-check"
        type="checkbox"
        variant="outline-primary"
        checked={selected}
        value="1"
        onChange={(e) => setSelected(e.currentTarget.checked)}
      >
        Twitch
      </ToggleButton>
    </div>
  );
}

export default ToggleApis;