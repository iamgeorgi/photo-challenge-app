import pool from './pool.js';

const searchBy = async (column, value) => {
    const sql = `
        SELECT id, username
        FROM users
        WHERE ${column} LIKE '%${value}%'
    `;
    return await pool.query(sql);
};

const getBy = async (column, value) => {
    const sql = `
        SELECT id, username, firstname, lastname, password, role
        FROM users
        WHERE ${column} = ?
    `;
    const result = await pool.query(sql, [value]);
    return result[0];
};

const create = async (username, firstname, lastname, password, email, role) => {
    const sql = `
        INSERT INTO users(username, firstname, lastname, password, email, points, role)
        VALUES (?,?,?,?,?, NULL, ?)
    `;

    const result = await pool.query(sql, [username, firstname, lastname, password, email, role]);

    return {
        id: result.insertId,
        username: username,
        firsname: firstname,
        lastname: lastname,
    };
};

const update = async (user) => {
    const { id, firstname, lastname } = user;

    const sql = `
        UPDATE users
        SET firstname = ?, lastname = ?
        WHERE id = ?
    `;

    return await pool.query(sql, [firstname, lastname, id]);
};


const getUsersByRole = async (roleId) => {
    const sql = `
      SELECT * FROM users
      WHERE role=?
    `;

    return await pool.query(sql, [roleId]);
};

const insertDefaultJuryScore = async (user_submit_id, users_id, contests_id) => {
    const sql = `
        INSERT INTO jury_scoring(score, comment, user_submit_id, users_id, contests_id)
        VALUES(3, '', ?, ?, ?);
    `;
    return await pool.query(sql, [user_submit_id, users_id, contests_id]);
};


export default {
    searchBy,
    getBy,
    create,
    update,
    getUsersByRole,
    insertDefaultJuryScore,
};