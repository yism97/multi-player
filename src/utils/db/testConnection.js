import dbpool from '../../DB/database.js';

export const testConnection = async (pool) => {
  try {
    const [rows] = await dbpool.query('SELECT 1 + 1 AS solution');
    console.log(`테스트 쿼리 결과: ${rows[0].solution}`);
  } catch (error) {
    console.error(error);
  }
};
