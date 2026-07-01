import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Cria um pool de conexões (mais seguro e rápido)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'senai',
  database: process.env.DB_NAME || 'data_base',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;