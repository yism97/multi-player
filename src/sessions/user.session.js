import User from '../classes/models/user.class.js';
import { userSessions } from './sessions.js';

export const addUser = (socket, id, playerId, latency) => {
  const user = new User(socket, id, playerId, latency);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getAllUser = () => {
  return userSessions;
};
