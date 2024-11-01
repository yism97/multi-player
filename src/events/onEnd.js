import { getGameSession } from '../sessions/game.session.js';
import { removeUser } from '../sessions/user.session.js';

// 클라이언트 연결 종료 시 호출되는 함수 정의
export const onEnd = (socket) => async () => {
  console.log('Client가 종료되었습니다.');

  // 사용자를 사용자 세션에서 제거 (비동기로)
  await removeUser(socket);

  // 게임 세션을 가져와 해당 세션에서 사용자 제거
  const gameSession = getGameSession();
  gameSession.removeUser(socket);
};
