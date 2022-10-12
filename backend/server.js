const dotenv = require('dotenv');
dotenv.config();
const { Server, Socket } = require('socket.io');
const express = require('express');
const app = express();
const { uniqueNamesGenerator, adjectives } = require('unique-names-generator');
const { random_color } = require('./helpers/userColors');
const axios = require('axios');
const bcrypt = require('bcrypt');

// twitch search route
app.get('/api/twitch_search', (req, res) => {
  let token = '';
  const term = req.query.term;
  const searchURL = `https://api.twitch.tv/helix/search/channels?query=${term}&live_only=true`;

  // if twitch auth token exists, validate token
  if (token) {
    axios.get('https://id.twitch.tv/oauth2/validate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        // if auth token less than 1 hour left, create new token
        if (response.data.expires_in < 3600) {
          axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE
          })
            .then(response => {
              token = response.data.access_token;
              //twitch search call
              return axios.get(searchURL, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Client-Id': process.env.CLIENT_ID
                }
              })
                .then(response => {
                  res.send(response.data);
                })
            })
        } else {
          // if token has time left continue with api search call
          return axios.get(searchURL, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Client-Id': process.env.CLIENT_ID
            }
          })
            .then(response => {
              res.send(response.data);
            })
        }
      })
  }
  // if token doesn't exist, create new token
  if (!token) {
    axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: process.env.GRANT_TYPE
    })
      .then(response => {
        token = response.data.access_token
        // twitch api search call
        return axios.get(searchURL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.CLIENT_ID
          }
        })
          .then(response => {
            res.send(response.data);
          })
      })
  }
});

// Youtube search
app.get('/api/youtube_search', (req, res) => {
  const terms = req.query.terms;
  const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${terms}&maxResults=20&type=video&key=${process.env.YOUTUBE_API_KEY}`;

  axios.get(searchURL).then(response => {
    res.send(response.data);
  })
})


const http = app.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});

const clients = {};
/* Clients Object
    name: {
    id: client id from the socket as a string, 
    rooms: [arr],  
    color: 'rgba(x,x,x)',
    username: 'string' // same as name by default
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
  const name = `${uniqueNamesGenerator({
    dictionaries: [adjectives],
    separator: ' ',
    style: 'capital'
  })} Parrot`;

  const color = random_color();
  // console.log('Client Connected!', name, ':', client.id);
  // Add client to lookup object. This is for server use. Ensures if names are the same it does not overwrite the old.
  !clients[name] && (clients[name] = { id: client.id, rooms: [], color, username: name });

  client.on('createOrJoinRoom', (req) => {

    const room = req.room;
    const password = req.room.password
    let hashedPassword = '';

    if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
    }

    client.join(room.name.toLowerCase().trim());

    if (!rooms[room.name]) {
      rooms[room.name] = room; // new room
      rooms[room.name].password = hashedPassword;
      rooms[room.name].users = []; // new user array
      rooms[room.name].host = name;
    }

    // password check
    if (rooms[room.name].password && !bcrypt.compareSync(password, rooms[room.name].password)) {
      // client.to(clients[name].id).emit('Error')
      return;
    }

    const user = {
      name,
      color,
    };
    rooms[room.name].users.push(user);
    clients[name].rooms.push(room.name);
    const id = clients[name].id;
    client.emit('serveRoom', { room: rooms[room.name] });
    client.to(room.name).emit('system', { system: 'announce', username: clients[name].username, room: rooms[room.name], color });
    io.to(id).emit('system', { system: 'welcome', username: clients[name].username, room: rooms[room.name], color });
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
    const { msg, room, to } = data;
    if (!msg) {
      return;
    }
    const username = clients[name].username;
    const message = msg.length > 1000 ? msg.slice(0, 1000) + '... your message is too long!' : msg;
    if (!to) {
      io.to(room.name).emit('public', { message, username, color });
      return;
    }
    const { id: idFrom, color: colorFrom } = clients[name];

    if (clients[to]) {
      const { id: idTo, color: colorTo, username: userTo } = clients[to];
      io.to(idTo).emit('private', { message, username: username, pm: 'receive', color: colorFrom }); // Receiver gets sender's color/name
      io.to(idFrom).emit('private', { message, username: userTo, pm: 'send', color: colorTo }); // Sender receives other's color
      return;
    }
    io.to(idFrom).emit('system', { system: 'left', username: to, room: rooms[room.name], color: '#fff' });
  });

  client.on('retrieveHostYoutubeTime', (req) => {
    const hostName = rooms[req.room.name].host;
    const id = clients[name].id
    if (name !== hostName) {
      const hostId = clients[hostName].id;
      io.to(hostId).emit('getHostYoutubeTime', { for: id });
    }
  });

  client.on('sendJoinerYoutubeTime', (req) => {
    io.to(req.for).emit('setJoinerYoutubeTime', { time: req.time });
  });

  client.on('editVideo', (req) => {
    const host = rooms[req.room.name].host;
    const roomName = req.room.name;
    if (name === host) {
      client.to(roomName).emit('serveVideo', { time: req.time, state: req.state });
    }
  });

  client.on('savePath', (req) => {
    const roomName = req.room.name;
    rooms[roomName].paths.push(req.path);
    client.to(roomName).emit('broadcastPath', { path: req.path });
  });

  client.on('eraseWhiteboard', (req) => {
    const roomName = req.room.name;
    rooms[roomName].paths = [];
    client.to(roomName).emit('broadcastErase', { path: [] });
    client.emit('broadcastErase', { path: [] });
  });

  client.on('disconnect', () => {
    // console.log('Client Disconnected', name, ':', client.id);
    clients[name].rooms.forEach(roomname => {
      rooms[roomname].users = rooms[roomname].users.filter(user => user.name !== name);
      if (rooms[roomname].users.length === 0) {
        delete rooms[roomname];
        return;
      }
      if (rooms[roomname].host === name) {
        const newHost = rooms[roomname].users[0].name;
        rooms[roomname].host = newHost;
        client.to(roomname).emit('system', { system: 'hostSwap', username: clients[newHost].username, room: rooms[roomname], color: clients[newHost].color });
      }
      client.to(roomname).emit('system', { system: 'exit', username: clients[name].username, room: rooms[roomname], color });
    });
    delete clients[name];
  });
});
