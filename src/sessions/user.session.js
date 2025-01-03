import User from '../classes/models/user.class.js';
import { updateUserLocation } from '../DB/user/user.db.js';
import { userSessions } from './sessions.js';

export const addUser = (user) => {
  userSessions.push(user);
  return user;
};
// 유저정보 세션에서 제거
export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    const user = userSessions[index];
    // 사용자가 나가기 전에 유저의 위치를 DB에 업데이트.
    await updateUserLocation(user.x, user.y, user.id);
    return userSessions.splice(index, 1)[0];
  }
};
// 소켓을 이용해 세션에서 사용자 객체를 찾는 함수
export const getUserBySocket = (socket) => {
  const user = userSessions.find((user) => user.socket === socket);
  if (!user) {
    // TODO
    console.log('User not found : getUserBySocket');
  }
  return user;
};
export const getAllUser = () => {
  return userSessions;
};
