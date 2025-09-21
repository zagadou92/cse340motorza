const { Pool } = require("pg");
require("dotenv").config();

let pool;

// Détection de l'environnement
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  // 🔹 Configuration pour développement local
  const user = process.env.DB_USER || "postgres";
  const password = String(process.env.DB_PASSWORD || "");
  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT, 10) || 5432;
  const database = process.env.DB_NAME || "cse340_assignment2";

  pool = new Pool({
    user,
    host,
    database,
    password,
    port,
    ssl: false, // 🔹 Désactivé pour dev local
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("Executed query:", { text, params });
        return res;
      } catch (error) {
        console.error("Error in query:", { text, params, error });
        throw error;
      }
    },
    pool,
  };
} else {
  // 🔹 Configuration pour production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true, // 🔹 SSL activé pour prod
    },
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("Executed query:", { text, params });
        return res;
      } catch (error) {
        console.error("Error in query:", { text, params, error });
        throw error;
      }
    },
    pool,
  };
}
