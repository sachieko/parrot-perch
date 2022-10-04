import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    axios
      .post("/login", { code })
      .then((response) => {
        console.log(response, 'pppppppppppppass');
        setAccessToken(response.data.accessToken);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.log(err, 'EEEEEEEEEEEEEEEEEEE');
        window.location = "/";
      });
  }, [code]);

  return accessToken
}