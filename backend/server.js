const { Server } = require('socket.io');
const express = require('express');
const app = express();
const spotifyWebApi = require('spotify-web-api-node');

const credentials = {
  clientId: 'deae5d0e24684efda2fd5ccf605f4029',
  clientSecret: '87b4b8fc0eaf44e689c009ca2ebd8c4b',
  redirectUri: 'http://localhost:3000/',
};


app.use(express.json());

app.post('/login', (req,res) => {
      let spotifyApi = new spotifyWebApi(credentials);  
      const code = req.body.code
      console.log(code);
      spotifyApi.authorizationCodeGrant(code).then((data) => {
          res.json({
              accessToken : data.body.access_token,
          }) 
      })
      .catch((err) => {
          console.log(err);
          res.sendStatus(400)
      })
  
  })

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const io = new Server(http);
const rooms = {};
io.on('connection', client => {
  console.log("Client Connected!");

  client.on('createOrJoinRoom', (req) => {
    const room = req.room;
    client.join(room.name);
    if (!rooms[room.name]) {
      rooms[room.name] = room; // new room
    }
    client.emit('serveRoom', { room: rooms[room.name] });
  });

  client.on('editRoom', (req) => {
    //possible to sanitize data here.
    const room = req.room;
    rooms[room.name].channel = room.channel;
    client.to(room.name).emit('serveRoom', { room: rooms[room.name] });
    client.emit('serveRoom', { room: rooms[room.name] });
  });

  client.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});
