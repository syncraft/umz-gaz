import * as io from 'socket.io-client';
export default io(process.env.URL);