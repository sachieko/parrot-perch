const { Server } = require('socket.io');
const express = require('express');
const app = express();

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const io = new Server(http);
const rooms = {}
io.on('connection', client => {
  console.log("Client Connected!");
  console.log(rooms)
  client.on('createOrJoinRoom', (req) => {
    if (!rooms[req.roomName]) {
      rooms[req.roomName] = { name: req.roomName }
      rooms[req.roomName].channel = ''
    }
    client.emit('hereIsYourRoom', rooms[req.roomName])
  });
  client.on('attachChannelToRoom', (req) => {
    console.log('reqiing ball', req);
    rooms[req.roomName].channel = req.channel
    client.emit('serveChannel', rooms[req.roomName])
  });
  client.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});
