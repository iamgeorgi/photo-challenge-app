import pool from './pool.js';

const getPhaseOneContests = async () => {
  const sql = `
    SELECT * FROM contests
    WHERE phase1 > NOW() AND isopen = 1
  `;

  return await pool.query(sql);
};

const getPhaseTwoContests = async () => {
  const sql = `
    SELECT * FROM contests
    WHERE phase1 < NOW() AND (DATE_ADD(phase1, INTERVAL phase2 HOUR) > NOW());
  `;

  return await pool.query(sql);
};

const getFinishedContests = async () => {
  const sql = `
    SELECT * FROM contests
    WHERE DATE_ADD(phase1, INTERVAL phase2 HOUR) < NOW();
  `;

  return await pool.query(sql);
};

const getContestBy = async (column, value) => {
  const sql = `
    SELECT *
    FROM contests
    WHERE ${column} = ?
  `;

  const result = await pool.query(sql, [value]);

  return result[0];
};

const getFinishedContestBy = async (column, value) => {
  const sql = `
    SELECT *
    FROM contests
    WHERE ${column} = ? AND (DATE_ADD(phase1, INTERVAL phase2 HOUR) < NOW());
  `;

  const result = await pool.query(sql, [value]);

  return result[0];
};


const getSubmissionsByContestId = async (contestId) => {
  const sql = `
    SELECT * FROM user_submit
    WHERE contests_id = ?
  `;
  const result = await pool.query(sql, [contestId]);

  return result;
};

const getCurrentUserSubmissionByContestId = async (contestId, userId) => {
  const sql = `
    SELECT * FROM user_submit
    WHERE contests_id = ? AND users_id = ?
  `;

  const result = await pool.query(sql, [contestId, userId]);

  return result[0];
};

const getCurrentUserSubmissions = async (userId) => {
  const sql = `
    SELECT * FROM user_submit
    WHERE users_id = ?
  `;

  return await pool.query(sql, [userId]);
};

const getFinishedSubmissionsByContestId = async (contestId, userId) => {
  const sql = `
    SELECT * FROM user_submit
    WHERE contests_id = ? AND NOT users_id = ?
  `;

  return await pool.query(sql, [contestId, userId]);
};


const getScoringsBySubmissionId = async (contestid, id) => {
  const sql = `
    SELECT js.id, js.score, js.comment, js.wrong_category, u.username
    FROM jury_scoring js
    JOIN users u
    ON u.id = js.users_id
    WHERE contests_id = ? AND user_submit_id = ?
  `;
  return await pool.query(sql, [contestid, id]);
};

const getAverageScore = async (contestid, id) => {
  const sql = `
    SELECT ROUND(AVG(score),2) as average_score
    FROM jury_scoring
    WHERE contests_id = ? AND user_submit_id = ?
  `;

  const result = await pool.query(sql, [contestid, id]);

  return result?.[0];
};

const getScoringsByContestId = async (value) => {
  const sql = `
    SELECT * FROM jury_scoring
    WHERE jury_scoring.contests_id = ? 
  `;
  const result = await pool.query(sql, [value]);

  return result;
};

const createContest = async (title, category, isopen, phase1, phase2, photo) => {
  const sql = `
    INSERT INTO contests(title, category, isopen, phase1, phase2, start_date, photo)
    VALUES(?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ? , NOW(), ?);
  `;

  const result = await pool.query(sql, [title, category, isopen, phase1, phase2, photo]);

  return getContestBy('id', result.insertId);
};

const insertUsersToPrivateContest = async (contests_id, users_id) => {
  const sql = `
    INSERT INTO private_users (contests_id, users_id)
    VALUES(?, ?);
  `;
  const result = await pool.query(sql, [contests_id, users_id]);

  return result;
};

const getUsersFromPrivateContest = async (users_id) => {
  const sql = `
    SELECT contests.id, contests.title, contests.category, contests.isopen, contests.phase1,contests.phase2, contests.start_date, contests.photo
    FROM private_users
    JOIN contests
    ON private_users.contests_id = contests.id
    WHERE private_users.users_id = ? AND contests.phase1 > NOW();
  `;
  const result = await pool.query(sql, [users_id]);

  return result;
};

const getAllContestsForCurrentUser = async (id) => {
  const sql = `
    SELECT c.id, c.title, c.category, c.isopen, c.phase1, c.phase2, c.photo, c.start_date 
    FROM contests c
    JOIN user_submit us
    ON us.contests_id = c.id
    WHERE us.users_id = ?;
  `;

  const result = await pool.query(sql, [id]);
  return result;
};

export default {
  getPhaseOneContests,
  getPhaseTwoContests,
  getFinishedContests,
  getContestBy,
  getFinishedContestBy,
  getSubmissionsByContestId,
  getCurrentUserSubmissions,
  getCurrentUserSubmissionByContestId,
  getFinishedSubmissionsByContestId,
  getScoringsByContestId,
  getAverageScore,
  getScoringsBySubmissionId,
  createContest,
  getAllContestsForCurrentUser,
  insertUsersToPrivateContest,
  getUsersFromPrivateContest,
};