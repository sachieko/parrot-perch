const { Server } = require('socket.io');
const express = require('express');
const app = express();

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
