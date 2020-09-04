import socketIo from 'socket.io';

import config from 'config';
import { generateMessage } from 'utils/helpers';
import { SOCKET, ERROR_CODES } from 'constants';
import { checkToken } from 'utils/authentication';
import { ApplicationError } from 'utils/response';


export const run = async ({ server }) => {
  const io = socketIo(server, {
    pingInterval: 3500,
    pingTimeout: 3000,
    upgradeTimeout: 5000,
  });

  io.use(async (socket, next) => {
    const { handshake = {} } = socket;
    const { query = {} } = handshake;

    const { AUTHORIZATION_HEADER } = config;

    if (!query[AUTHORIZATION_HEADER]) {
      console.log('Error thrown');
      socket.disconnect('ГДЕ ТОКЕН, БЛЯТЬ?!');
      setTimeout(() => {
      }, 1000);
      throw new ApplicationError({
        statusCode: 401,
        errorMessage: 'Access token is expired or invalid',
        errorCode: ERROR_CODES.security__invalid_token_error,
        errors: [],
      });
    }

    const accessToken = ((query[AUTHORIZATION_HEADER] || query[AUTHORIZATION_HEADER.toLowerCase()] || ''))
      .replace('Bearer ', '');
    const { name } = await checkToken(accessToken, socket);
    socket.handshake.query.name = name;

    next();
  });

  await io.on(SOCKET.CONNECTION, (socket) => {
    console.log('New WebSocket connection');
    const { handshake = {} } = socket;
    const { query = {} } = handshake;
    const { name } = query;
    const USERNAME = `${name.trim()[0].toUpperCase()}${name.slice(1)}`;

    socket.on(SOCKET.JOIN_ROOM, (callback) => {
      // send message to connected client
      socket.emit(SOCKET.SYSTEM_MESSAGE, generateMessage('Admin', 'Welcome!'));

      // send message to all users in room except connected client
      socket.broadcast.emit(
        SOCKET.SYSTEM_MESSAGE,
        generateMessage('Admin', `${USERNAME} has joined!`),
      );

      if (callback) {
        callback();
      }
    });

    socket.on(SOCKET.SEND_MESSAGE, (message, callback) => {
      if (!message) {
        return callback('Empty messages are not allowed');
      }

      // send message to all users in room
      io.emit(SOCKET.SYSTEM_MESSAGE, generateMessage(USERNAME, message));

      if (callback) {
        callback();
      }
    });

    socket.on(SOCKET.DISCONNECT, () => {
      console.log('Got disconnect!');
      io.emit(SOCKET.SYSTEM_MESSAGE, generateMessage('Admin', `${USERNAME} has left!`));
    });
  });
};
