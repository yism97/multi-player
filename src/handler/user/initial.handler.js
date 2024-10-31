import User from '../../classes/models/user.class.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../DB/user/user.db.js';
import { getGameSession } from '../../sessions/game.session.js';
import { addUser } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, latency, playerId } = payload;

    let user = await findUserByDeviceId(deviceId);
    let coords = { x: 0, y: 0 }; // default

    if (!user) {
      await createUser(deviceId);
    } else {
      await updateUserLogin(deviceId);
      coords.x = user.xCoord;
      coords.y = user.yCoord;
    }
    user = new User(socket, deviceId, playerId, latency, coords);

    addUser(user);
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
