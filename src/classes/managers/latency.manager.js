class LatencyManager {
  constructor() {
    // 사용자 ID와 interval을 저장하기 위한 Map 객체 생성
    this.intervals = new Map();
  }

  // 특정 사용자에게 interval을 추가
  addUser(userId, callback, timestamp) {
    if (!this.intervals.has(userId)) {
      //TODO 에러처리
      console.error('중복된 인터벌이 발견되었습니다.');
    }
    // userId를 키로 하여 interval 설정 및 Map에 추가
    this.intervals.set(userId, setInterval(callback, timestamp));
  }

  // 특정 사용자의 interval을 제거
  removeUser(userId) {
    if (!this.intervals.has(userId)) {
      return;
    }
    clearInterval(this.intervals.get(userId));
  }

  // 모든 interval을 제거
  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.intervals.clear();
  }
}

export default LatencyManager;
