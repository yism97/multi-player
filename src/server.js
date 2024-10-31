import net from 'net';
import { HOST, PORT } from './constants/env.js';
import { onConnection } from './events/onConnection.js';
import initServer from './init/index.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`서버가 ${HOST}:${PORT}에서 실행 중이에유.`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
