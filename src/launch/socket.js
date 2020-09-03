import socketIo from 'socket.io';


export const run = async ({ server }) => {
  const io = socketIo(server);

  await io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', () => {
      console.log('Joined!');

      socket.emit('message', 'Hi!');
    });

    socket.on('sendMessage', (message) => {
      socket.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });
};
