import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

// 클라이언트가 소켓을 통해 서버에 연결될 때 호출되는 함수
export const onConnection = (socket) => {
  console.log(`Client connected from : ${socket.remoteAddress}:${socket.remotePort}`);

  socket.buffer = Buffer.alloc(0);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
