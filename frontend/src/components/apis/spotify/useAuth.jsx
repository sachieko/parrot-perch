import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    console.log(code);
    axios
      .post("/login", { code })
      .then((response) => {
        console.log(response, 'pppppppppppppass');
        // If success then cut the code string from the URL and execute the other thing
        window.history.pushState({}, null, "/");
        setAccessToken(response.data.accessToken);
      })
      .catch((err) => {
        console.log(err, 'EEEEEEEEEEEEEEEEEEE');
        window.location = "/";
      });
  }, [code]);

  return accessToken
}