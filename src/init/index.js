import { addGameSession } from '../sessions/game.session.js';
import { testConnection } from '../utils/db/testConnection.js';
import { loadProtos } from './loadProto.js';
import { v4 as uuidv4 } from 'uuid';

// 서버 시작을 위한 함수 정의
const initServer = async () => {
  try {
    await loadProtos();
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);
    await testConnection();
    console.log(gameSession);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default initServer;
