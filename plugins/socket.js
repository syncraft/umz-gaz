import * as io from 'socket.io-client';

export default function({}, inject) {
  inject('socket', io(process.env.URL));
}