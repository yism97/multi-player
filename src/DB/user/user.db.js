import { toCamelCase } from '../../utils/transfornCase.js';
import dbpool from '../database.js';
import { USER_QUERIES } from './user.queries.js';

// 디바이스 ID를 기반으로 사용자를 검색
export const findUserByDeviceId = async (deviceId) => {
  // // 데이터베이스에서 쿼리를 실행하여 특정 디바이스 ID를 가진 사용자 정보 가져오기
  const [row] = await dbpool.query(USER_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  // 가져온 사용자 정보를 snakeCase 형식이 아닌 camelCase 형식으로 변환하여 반환
  return toCamelCase(row[0]);
};

// 새로운 사용자를 생성하는 함수
export const createUser = async (deviceId) => {
  await dbpool.query(USER_QUERIES.CREATE_USER, [deviceId]);
  return { deviceId };
};

// 사용자의 로그인 상태를 업데이트하는 함수
export const updateUserLogin = async (deviceId) => {
  await dbpool.query(USER_QUERIES.UPDATE_USER_LOGIN, [deviceId]);
};

// 사용자의 위치 정보를 업데이트하는 함수
export const updateUserLocation = async (x, y, deviceId) => {
  // 위치 정보(x, y 좌표)를 업데이트하는 쿼리 실행
  await dbpool.query(USER_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId]);
};
