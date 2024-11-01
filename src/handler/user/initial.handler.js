import User from '../../classes/models/user.class.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../DB/user/user.db.js';
import { getGameSession } from '../../sessions/game.session.js';
import { addUser } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
// 초기 핸들러 정의
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, latency, playerId } = payload;

    // 데이터베이스에서 deviceId로 사용자 찾기
    let user = await findUserByDeviceId(deviceId);
    let coords = { x: 0, y: 0 }; // default 좌표 설정

    // 사용자가 존재하지 않으면 새 사용자 생성
    if (!user) {
      await createUser(deviceId);
    } else {
      // 사용자가 이미 존재하는 경우, 로그인 정보 업데이트
      await updateUserLogin(deviceId);
      // 기존 사용자 좌표로 설정
      coords.x = user.xCoord;
      coords.y = user.yCoord;
    }

    // 새로운 User 객체 생성
    user = new User(socket, deviceId, playerId, latency, coords);

    addUser(user);

    // GameSession에 User 추가
    const gameSession = getGameSession();
    gameSession.addUser(user);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceId, // 고유한 아이디
      x: user.x,
      y: user.y,
    });

    socket.write(initialResponse);
  } catch (e) {
    console.error(e);
  }
};
export default initialHandler;
