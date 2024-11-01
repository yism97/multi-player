import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbpool from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSchema = async () => {
  const sqlDir = path.join(__dirname, '../sql');

  try {
    const sql = fs.readFileSync(sqlDir + '/user_db.sql', 'utf8');

    // 구석까지 극한으로 쿼리 뽑아내기
    const queries = sql
      .split(';')
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    for (const query of queries) {
      await dbpool.query(query);
    }
  } catch (e) {
    console.error('데이터베이스 마이그레이션 에러!!,', e);
  }
};

createSchema()
  .then(() => {
    console.log('마이그레이션 성공 !');
  })
  .catch((e) => {
    console.log(e);
  });
