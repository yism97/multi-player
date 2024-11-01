import { createLocationPacket } from '../../utils/notification/game.notification.js';
// Game 클래스 정의
class Game {
  constructor(id) {
    this.id = id;
    this.users = []; // 게임에 참여 중인 사용자들의 배열
  }
  addUser(user) {
    this.users.push(user); // 새 사용자를 users 배열에 추가
  }
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // 사용자를 게임에서 제거
  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      // 사용자가 존재할 경우
      // users 배열에서 해당 사용자를 제거하고 제거된 사용자 객체 반환
      return this.users.splice(index, 1)[0];
    }
  }
  // 다른 모든 사용자들의 위치 정보 가져오기
  getAllLocation(userId) {
    const locationData = this.users
      .filter((user) => user.id !== userId) // 본인을 제외한 사용자 필터링
      // map 함수로 사용자 위치 정보 추출
      .map((user) => {
        return { id: user.id, playerId: user.playerId, x: user.x, y: user.y };
      });

    return createLocationPacket(locationData);
  }
}

export default Game;
