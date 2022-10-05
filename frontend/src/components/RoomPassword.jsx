import { useState } from "react";

export default function RoomPassword(props) {

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {

    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <input type={passwordShown ? "text" : "password"} onSubmit={props.onSubmit} />
      <button onClick={togglePassword}>Show Password</button>
    </div>
  );
}