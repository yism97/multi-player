class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
  }
  addUser(user) {
    this.users.push(user);
  }
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }
  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }
  getAllLocation() {}
}

export default Game;
