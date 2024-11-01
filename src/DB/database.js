import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

// mysql2모듈을 이용한 데이터베이스 연결 풀을 생성하는 함수
const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    ...config.database, // 설정 파일에 정의된 데이터베이스 정보 사용
    waitForConnections: true, // 최대 연결 수에 도달하면 연결 요청 대기하기
    connectionLimit: 10, // 동시에 가능한 최대 연결 수
    queueLimit: 0, // 연결 대기열에는 제한X
  });

  // 기본 query 메서드를 백업하여 저장 (나중에 호출하기 위해)
  const originalQuery = pool.query;

  // query 메서드를 재정의하여 쿼리 실행 시 로그를 기록
  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] Excuting query: ${sql} with ${params ? `${JSON.stringify(params)}` : ``}`,
    );

    return originalQuery.call(pool, sql, params);
  };
  return pool;
};

const dbpool = createPool();

export default dbpool;
