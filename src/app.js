const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const viewsRouter = require('./routes/views.router');
const PORT = 8080;
const serverMessage = `Server is running on port ${PORT}`;

//! Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Public Folder
app.use(express.static(`${__dirname}/public`));

//! Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

//! Routes
app.use('/', viewsRouter);

//! Express
const httpServer = app.listen(PORT, () => {
  console.log(serverMessage);
})

//! Socket io
const io = new Server(httpServer);


// Array for messages received from the client
let messages = [];

// Event 'new connection'
io.on('connection', (socket) => {
  console.log(`User with id:${socket.id} connected...`);

  //! Chat Events

  // Recive Event: message received from the client
  socket.on('userMessage', (messageData) => {
    // Save message received in the array of messages
    messages.push(messageData);
    // Send Event: for all clients-sockets!
    io.emit('messages', { messages });
  })

  // Recive Event: user authenticated
  socket.on('authenticated', ({ username }) => {
    // Send Event with the messages in the array: for this client-socket!
    socket.emit('messages', { messages });
    // Send Event: for all users except the one connecting!
    socket.broadcast.emit('newUserConnected', { newUsername: username });
  })

  // Recive Event: disconnect
  socket.on('disconnect', () => {
    console.log(`User with id:${socket.id} disconnected...`);
  })
})
