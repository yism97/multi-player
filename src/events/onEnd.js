import { getGameSession } from '../sessions/game.session.js';
import { removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('Client가 종료되었습니다.');

  await removeUser(socket);

  const gameSession = getGameSession();
  gameSession.removeUser(socket);
};
