import pool from './pool.js';

const createSubmission = async (title, story, photo, users_id, contests_id) => {
  const sql = `
    INSERT INTO user_submit(title, story, photo, users_id, contests_id)
    VALUES(?, ?, ?, ?, ?);
  `;

  const result = await pool.query(sql, [title, story, photo, users_id, contests_id]);

  return result;
};

const isSubmissionAlreadyExist = async (id, contestid) => {
  const sql = `
    SELECT users_id, contests_id, COUNT(*) 
    FROM user_submit
    WHERE users_id = ? AND contests_id = ?
    GROUP BY users_id, contests_id
    HAVING COUNT(*) > 0
  `;
  const result = await pool.query(sql, [id, contestid]);

  return result[0];
};

const getSubmissionsBy = async (column, value) => {
  const sql = `
    SELECT * FROM user_submit
    WHERE ${column} = ?
  `;

  return await pool.query(sql, [value]);
};

const getSubmissionsByUser = async (column, contestid, id) => {
  const sql = `
    SELECT * FROM ${column}
    WHERE contests_id = ? AND users_id = ?;
  `;

  return await pool.query(sql, [contestid, id]);
};

const getPhaseOneContestBy = async (column, value) => {
  const sql = `
    SELECT *
    FROM contests
    WHERE ${column} = ? AND phase1 > NOW()
  `;

  const result = await pool.query(sql, [value]);

  return result[0];
};


export default {
  createSubmission,
  isSubmissionAlreadyExist,
  getSubmissionsBy,
  getSubmissionsByUser,
  getPhaseOneContestBy,
};