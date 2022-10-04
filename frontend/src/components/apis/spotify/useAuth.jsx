import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    axios
      .post("/spotify/login", { code })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  return accessToken;
}