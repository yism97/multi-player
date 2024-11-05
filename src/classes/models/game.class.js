import { createLocationPacket } from '../../utils/notification/game.notification.js';
import LatencyManager from '../managers/latency.manager.js';
// Game 클래스 정의
class Game {
  constructor(id) {
    this.id = id;
    this.users = []; // 게임에 참여 중인 사용자들의 배열
    this.latencyManager = new LatencyManager();
  }
  addUser(user) {
    this.users.push(user); // 새 사용자를 users 배열에 추가

    this.latencyManager.addUser(user.id, user.ping.bind(user), 1000); // LatencyManager에 사용자 추가
  }
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // 사용자를 게임에서 제거
  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    // 사용자가 존재할 경우
    if (index !== -1) {
      if (this.users.length === 1) {
        this.latencyManager.clearAll(); // 접속중인 유저가 한명이면 LatencyManager 초기화
      }
      this.latencyManager.removeUser(this.users[index].id); // LatencyManager에서 해당 사용자 제거
      // users 배열에서 해당 사용자를 제거하고 제거된 사용자 객체 반환
      return this.users.splice(index, 1)[0];
    }
  }

  // 모든 사용자 중 최대 지연 시간
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }
  // 다른 모든 사용자들의 위치 정보 가져오기
  getAllLocation(userId) {
    const maxLatency = this.getMaxLatency(); // 가장 높은 latancy

    const locationData = this.users
      .filter((user) => user.id !== userId) // 본인을 제외한 사용자 필터링
      // map 함수로 사용자 위치 정보 추출
      .map((user) => {
        const { x, y } = user.calculatePosition(maxLatency); // calculatePosition 함수로 위치 계산
        return { id: user.id, playerId: user.playerId, x, y };
      });

    return createLocationPacket(locationData);
  }
}

export default Game;
