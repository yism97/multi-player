import { getGameSession } from '../../sessions/game.session.js';

// 위치 업데이트를 처리하는 핸들러 함수 정의
export const locationUpdateHandler = ({ socket, userId, payload }) => {
  try {
    // payload에서 x, y 위치 좌표를 추출
    const { x, y } = payload;

    // 현재 게임 세션 가져오기
    const gameSession = getGameSession();
    if (!gameSession) {
      console.error('게임 세션이 존재하지 않습니다.');
    }

    console.log(gameSession);

    // 게임 세션에서 특정 userId에 해당하는 사용자 찾기
    const user = gameSession.getUser(userId);
    if (!user) {
      console.error('유저가 존재하지 않습니다.');
    }

    // 사용자의 위치 업데이트
    user.updatePosition(x, y);

    // 업데이트된 위치 정보를 포함한 다른 사용자들의 위치 데이터 가져오기
    const LocationData = gameSession.getAllLocation(userId);

    // 소켓을 통해 위치 데이터 전송하기
    socket.write(LocationData);
  } catch (e) {
    console.error(e);
  }
};

export default locationUpdateHandler;
