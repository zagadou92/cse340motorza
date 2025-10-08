const { Pool } = require("pg");
require("dotenv").config();

// Détection de l'environnement
const isDev = process.env.NODE_ENV === "development";

// Configuration du pool
const pool = isDev
  ? new Pool({
      user: process.env.DB_USER || "postgres",
      password: String(process.env.DB_PASSWORD || ""),
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || "assignment2_j7kn",
      ssl: false, // 🔹 désactivé en dev
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // 🔹 requis pour Render
    });

// Fonction utilitaire pour exécuter les requêtes
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    if (isDev) console.log("Executed query:", { text, params });
    return res;
  } catch (error) {
    console.error("Database query error:", { text, params, error });
    throw error;
  }
}

module.exports = {
  query,
  pool,
};
