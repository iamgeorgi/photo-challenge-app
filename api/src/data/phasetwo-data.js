import pool from './pool.js';

const getAllPhasetwoSubmissions = async (userSubmitionId, contestId) => {
  const sql = `
    SELECT * FROM jury_scoring
    WHERE user_submit_id = ? AND contests_id = ?
  `;

  return await pool.query(sql, [userSubmitionId, contestId]);
};

const isScoreExisting = async (userSubmitionId, userId, contestId) => {
  const sql = `
    SELECT user_submit_id, users_id, comment, COUNT(*) 
    FROM jury_scoring
    WHERE user_submit_id = ? AND users_id = ? AND contests_id = ?
    GROUP BY user_submit_id, users_id
    HAVING COUNT(*) > 0
  `;
  const result = await pool.query(sql, [userSubmitionId, userId, contestId]);

  return result[0];
};

const updateJuryScore = async (score, comment, wrong_category, userSubmitionId, userId, contestId) => {
  const sql = `
    UPDATE jury_scoring SET 
    score = ?, comment = ?, wrong_category = ?
    WHERE user_submit_id = ? AND users_id = ? AND contests_id = ?
  `;

  return await pool.query(sql, [score, comment, wrong_category, userSubmitionId, userId, contestId]);
};
const getPhaseTwoContestBy = async (column, value) => {
  const sql = `
    SELECT *
    FROM contests
    WHERE ${column} = ? AND (phase1 < NOW() AND (DATE_ADD(phase1, INTERVAL phase2 HOUR) > NOW()))
  `;

  const result = await pool.query(sql, [value]);

  return result[0];
};



export default {
  getAllPhasetwoSubmissions,
  updateJuryScore,
  isScoreExisting,
  getPhaseTwoContestBy,
};