const { Server } = require('socket.io');
const express = require('express');
const app = express();
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const clients = {};
const io = new Server(http);
const rooms = {};
<<<<<<< HEAD

io.on('connection', client => {
  const name = uniqueNamesGenerator({
    dictionaries: [starWars]
  });

  const random_rgba = function() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  };

  const color = random_rgba();
  // console.log('Client Connected!', name, ':', client.id);
  
  clients[name] = {id: client.id};  // Add client to lookup object. This is server information only.
  // console.log('Clients: ', clients);
=======
io.on('connection', client => {
  console.log("Client Connected!");
>>>>>>> main

  client.on('createOrJoinRoom', (req) => {
    const room = req.room;
    client.join(room.name);
    if (!rooms[room.name]) {
      rooms[room.name] = room; // new room
<<<<<<< HEAD
      rooms[room.name].users = []; // new user array
    }
    const user = { 
      name,
      color
    };
    rooms[room.name].users.push(user);
    client.emit('serveRoom', { room: rooms[room.name], users: rooms[room.name].users });
=======
    }
    client.emit('serveRoom', { room: rooms[room.name] });
>>>>>>> main
  });

  client.on('editRoom', (req) => {
    //possible to sanitize data here.
    const room = req.room;
    rooms[room.name].channel = room.channel;
<<<<<<< HEAD
    rooms[room.name].users = room.users;
    client.to(room.name).emit('serveRoom', { room: rooms[room.name], users: rooms[room.name].users });
    client.emit('serveRoom', { room: rooms[room.name], users: rooms[room.name].users });
  });


  client.broadcast.emit('system', {message: `Arr, ye've been boarded by ${name}!`, roomUsers});
  client.emit('system', {message: `Arr, welcome to the room ${name}!`, roomUsers});


  client.on('message', data => {
    // console.log('Data received:', data);
    const {msg, to} = data
    const username = name;
    if (!to) {
      client.emit('public', {msg, username});
      client.broadcast.emit('public', {msg, username});
      return;
    }
    const id = clients[to].id;
    // console.log(`Sending message to ${to}:${id}`);
    io.to(id).emit('private', {msg, username});
  })

  client.on('disconnect', () => {
    console.log('Client Disconnected', name, ':', client.id);
    client.broadcast.emit('system', `${name} has just walked the plank!`);
    rooms[room.name].users.filter(user => user.name !== name);
    delete clients[name];
=======
    client.to(room.name).emit('serveRoom', { room: rooms[room.name] });
    client.emit('serveRoom', { room: rooms[room.name] });
  });

  client.on("disconnect", () => {
    console.log("Client Disconnected");
>>>>>>> main
  });
});
