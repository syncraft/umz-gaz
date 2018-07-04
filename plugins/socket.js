import * as io from 'socket.io-client';

const socket = io(process.env.URL, {
  transports: ['websocket']
});

export default function(_, inject) {
  inject('socket', socket);
}