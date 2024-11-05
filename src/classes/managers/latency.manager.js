class LatencyManager {
  constructor() {
    this.intervals = new Map();
  }

  addUser(userId, callback, timestamp) {
    if (!this.intervals.has(userId)) {
      //TODO 에러처리
      console.error('중복된 인터벌이 발견되었습니다.');
    }
    this.intervals.set(userId, setInterval(callback, timestamp));
  }
  removeUser(userId) {
    if (!this.intervals.has(userId)) {
      return;
    }
    clearInterval(this.intervals.get(userId));
  }

  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.intervals.clear();
  }
}

export default LatencyManager;
