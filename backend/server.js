const dotenv = require('dotenv');
dotenv.config();
const { Server, Socket } = require('socket.io');
const express = require('express');
const app = express();
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');

const http = app.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});

const clients = {};
const io = new Server(http);
const rooms = {};

io.on('connection', client => {
  const name = uniqueNamesGenerator({
    dictionaries: [starWars]
  });

  const random_rgba = function () {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  };

  const color = random_rgba();
  console.log('Client Connected!', name, ':', client.id);

  clients[name] = { id: client.id, rooms: [], color };  // Add client to lookup object. This is for server use.

  client.on('createOrJoinRoom', (req) => {
    const room = req.room;
    client.join(room.name);
    if (!rooms[room.name]) {
      rooms[room.name] = room; // new room
      rooms[room.name].users = []; // new user array
      rooms[room.name].host = name;
    }
    const user = {
      name,
      color,
    };
    rooms[room.name].users.push(user);
    clients[name].rooms.push(room.name);
    const id = clients[name].id;
    const hostName = rooms[room.name].host;
    if (name !== hostName) {
      const hostId = clients[hostName].id;
      io.to(hostId).emit('getHostYoutubeTime', { for: id });
    }
    client.emit('serveRoom', { room: rooms[room.name] });
    client.to(room.name).emit('system', { message: `Arr, ye've been boarded by ${name}!`, room: rooms[room.name] });
    io.to(id).emit('system', { message: `Welcome to the room, ${name}!`, room: rooms[room.name] })
  });

  client.on('editRoom', (req) => {
    //possible to sanitize data here.
    const room = req.room;
    rooms[room.name].channel = room.channel;
    rooms[room.name].youtubeVideo = room.youtubeVideo;
    client.to(room.name).emit('serveRoom', { room: rooms[room.name] });
    client.emit('serveRoom', { room: rooms[room.name] });
  });

  client.on('message', data => {
    // console.log('Data received:', data);
    const { msg, room, to } = data
    if (!msg) {
      return;
    }
    const username = name;
    if (!to) {
      io.to(room.name).emit('public', { msg, username });
      return;
    }
    const id = clients[to].id;
    // console.log(`Sending message to ${to}:${id}`);
    io.to(id).emit('private', { msg, username });
  })

  client.on('sendJoinerYoutubeTime', (req) => {
    io.to(req.for).emit('setJoinerYoutubeTime', { time: req.time });
  });

  client.on('editVideo', (req) => {
    const host = rooms[req.room.name].host;
    const roomName = req.room.name;
    if (name === host){
      rooms[roomName] = req.room;
      client.to(roomName).emit('serveVideo', { room: rooms[roomName] });
    }
  });

  client.on('disconnect', () => {
    console.log('Client Disconnected', name, ':', client.id);
    clients[name].rooms.forEach(roomname => {
      rooms[roomname].users = rooms[roomname].users.filter(user => user.name !== name);
      if (rooms[roomname].users.length === 0) {
        delete rooms[roomname];
        return;
      } else if (rooms[roomname].host === name){
        const newHost = rooms[roomname].users[0].name;
        rooms[roomname].host = newHost;
        //client.to(roomname).emit('system', { message: `Host ${name} died. New host: ${newHost} `, room: rooms[roomname] });
      }
      client.to(roomname).emit('system', { message: `${name} has just walked the plank!`, room: rooms[roomname] });
    });
    delete clients[name];
  });
});
