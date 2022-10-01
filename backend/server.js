const { Server } = require('socket.io');
const express = require('express');
const app = express();
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const clients = {};
const io = new Server(http);

io.on('connection', client => {
  const name = uniqueNamesGenerator({
    dictionaries: [starWars]
  });

  console.log('Client Connected!', name, ':', client.id);

  client.emit('system', `Arr, welcome to the room ${name}!`);
  client.broadcast.emit('system', `Arr, ye've been boarded by ${name}!`);

  clients[name] = client.id;  // Add client to lookup object. We will need to do more work to implement private rooms.
  // console.log('Clients: ', clients);


  client.on('message', data => {
    // console.log('Data received:', data);
    const {msg, to} = data
    const username = name;
    if (!to) {
      client.emit('public', {msg, username});
      client.broadcast.emit('public', {msg, username});
      return;
    }
    const id = clients[to];
    // console.log(`Sending message to ${to}:${id}`);
    io.to(id).emit('private', {msg, username});
  })

  client.on('disconnect', () => {
    console.log('Client Disconnected', name, ':', client.id);
    client.broadcast.emit('system', `${name} has just walked the plank!`);
    delete clients[name];
  });
});
