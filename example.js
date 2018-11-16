const Server = require('./server');

const port = 5000;
const server = new Server();

/* eslint-disable no-console */

server.listen(port).then(() => {
  console.log(`⚡ Listening on *:${port}`);
});

server.on('connection', socket => {
  socket.send('message');

  socket.on('text', message => {
    console.log(`Client says "${message}"`);
  });
});
