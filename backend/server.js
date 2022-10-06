const dotenv = require('dotenv');
dotenv.config();
const { Server } = require('socket.io');
const express = require('express');
const app = express();
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');

const http = app.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});

const clients = {};
/* Clients Object
    name: {
    id: client id from the socket as a string, 
    rooms: [arr],  
    color: 'rgba(x,x,x)',
    displayname: 'string' // same as name by default
  }
*/ 
const io = new Server(http);

const rooms = {};
// rooms object shape = {
//  name: {
//    name: 'room name',
//    password: 'password',
//    channel: '',
//    users: [array]
//  } 
// }

io.on('connection', client => {
  const name = uniqueNamesGenerator({
    dictionaries: [starWars]
  });

  const random_rgba = function () {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  };

  const color = random_rgba();
  // console.log('Client Connected!', name, ':', client.id);
  // Add client to lookup object. This is for server use. Ensures if names are the same it does not overwrite the old.
  !clients[name] && (clients[name] = { id: client.id, rooms: [], color, displayname: name });  

  client.on('createOrJoinRoom', (req) => {

    const room = req.room;

    client.join(room.name);

    
    if (!rooms[room.name]) {
      rooms[room.name] = room; // new room
      rooms[room.name].users = []; // new user array
      console.log(`New room ${room.name} created`)
    } 

    // password check happens here
    if (rooms[room.name].password && room.password !== rooms[room.name].password) {
      console.log('Incorrect password');
      return;
    }

    const user = {
      name,
      color,
    };
    console.log(rooms);
    rooms[room.name].users.push(user);
    clients[name].rooms.push(room.name);
    const id = clients[name].id
    client.emit('serveRoom', { room: rooms[room.name] });
    client.to(room.name).emit('system', { message: `Arr, ye've been boarded by ${name}!`, room: rooms[room.name] });
    io.to(id).emit('system', { message: `Welcome to the room, ${name}!`, room: rooms[room.name] });
    console.log(`Welcome to ${room.name}`);
  });

  client.on('editRoom', (req) => {
    //possible to sanitize data here.
    const room = req.room;
    rooms[room.name].channel = room.channel;
    client.to(room.name).emit('serveRoom', { room: rooms[room.name] });
    client.emit('serveRoom', { room: rooms[room.name] });
  });

  client.on('message', data => {
    const { msg, room, to } = data
    if (!msg) {
      return;
    }
    const username = name;
    if (!to) {
      io.to(room.name).emit('public', { message, username, color });
      return;
    }
    const id = clients[to].id;
    io.to(id).emit('private', { message, username, pm: true });
  })

  client.on('disconnect', () => {
    // console.log('Client Disconnected', name, ':', client.id);
    clients[name].rooms.forEach(roomname => {
      rooms[roomname].users = rooms[roomname].users.filter(user => user.name !== name);
      if (rooms[roomname].users.length === 0) {
        delete rooms[roomname];
        return;
      }
      client.to(roomname).emit('system', { message: `${name} has just walked the plank!`, room: rooms[roomname] });
    });
    delete clients[name];
  });
});
