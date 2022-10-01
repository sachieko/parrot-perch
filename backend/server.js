const { Server } = require('socket.io');
const express = require('express');
const app = express();

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const io = new Server(http);

io.on('connection', client => {
  console.log("Client Connected!");
  client.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});
