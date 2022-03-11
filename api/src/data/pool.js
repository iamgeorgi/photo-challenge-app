import mariadb from 'mariadb';
import { DB_CONFIG } from './../../config.js';

const pool = mariadb.createPool(DB_CONFIG);

export default pool;