class User {
  constructor(socket, id, playerId, latency, coords) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = coords.x; // 사용자의 초기 x 위치
    this.y = coords.y; // 사용자의 초기 y 위치
    this.lastX = 0; // 이전 x 위치
    this.lastY = 0; // 이전 y 위치
    this.lastUpdateTime = Date.now(); // 마지막 위치 업데이트 시간
    this.speed = 3; // 사용자 이동 속도
  }

  // 사용자의 위치를 업데이트하는 메서드
  updatePosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  // 핑(ping) 패킷을 전송하는 메서드
  ping() {
    const now = Date.now();

    this.socket.write(createPingPacket(now));
  }

  // 핑에 대한 응답(pong)을 처리하는 메서드
  handlerPong() {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2; // 지연 시간 계산
  }

  // 사용자의 위치를 지연 시간을 고려하여 계산하는 메서드
  calculatePosition(latency) {
    // 사용자가 이동하지 않았으면 현재 위치 반환
    if (this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    // 위치 업데이트 시간 차이와 지연 시간을 고려한 시간 차이 계산
    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;

    // 시간 차이에 따른 이동 거리 계산(거리 = 속력 * 시간)
    const distance = this.speed * timeDiff;

    const directionX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
    const directionY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;
    // 새로운 위치를 계산하여 반환
    return {
      x: this.x + directionX * distance,
      y: this.y + directionY * distance,
    };
  }
}
export default User;
