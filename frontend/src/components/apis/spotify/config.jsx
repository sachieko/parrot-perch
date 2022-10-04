const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/";
const clientId = "deae5d0e24684efda2fd5ccf605f4029";
const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
];
const url = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}`;

export default url;
