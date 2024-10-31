import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../sessions/game.session.js';
import { addUser } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const initialHandler = ({ socket, userId, payload }) => {
  try {
    const { deviceid, latency, playerId } = payload;
    const user = addUser(socket, deviceid, latency, playerId);
    const gameSession = getGameSession();
    gameSession.addUser(user);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceid, // 고유한 아이디
    });

    socket.write(initialResponse);
  } catch (e) {
    console.error(e);
  }
};
export default initialHandler;
