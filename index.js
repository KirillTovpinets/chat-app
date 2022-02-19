const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const config = require('./config.json');
const passport = require('passport');

const http = require('http');
const server = http.Server(app);

const socket = require('socket.io');
const bodyParser = require('body-parser');
const io = socket(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(session({
  secret: 'my secret',
  resave: true, 
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
require('./passport-config')(passport);

app.use((req, res, next) => {
  console.log(req.user);
  next();
})

app.use('/api', require('./routes/api.routes'));

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.roomId);
    socket.broadcast.to(data.roomId).emit('user joined');
  })

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', { user: data.user, message: data.message})
  })
})

mongoose.connect(config.dbconnection, function(err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('Mongodb connected');
})

server.listen(port, () => {
  console.log('Connected on port:' + port);
})