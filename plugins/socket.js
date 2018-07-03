import * as io from 'socket.io-client';

export default function(_, inject) {
  inject('socket', io(process.env.URL, {
    transports: ['websocket']
  }));
}