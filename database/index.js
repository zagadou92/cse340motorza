const { Pool } = require("pg");
require("dotenv").config();

// Détection de l'environnement
const isDev = process.env.NODE_ENV === "development";

// Configuration du pool PostgreSQL
const pool = isDev
  ? new Pool({
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || "cse340_assignment2",
      ssl: false, // 🔹 désactivé en dev
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL, // Render fournit DATABASE_URL
      ssl: {
        rejectUnauthorized: false, // 🔹 requis pour Render en prod
      },
    });

// Fonction utilitaire pour exécuter les requêtes
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    if (isDev) {
      console.log("✅ Executed query:", { text, params, rowCount: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("❌ Database query error:", { text, params, error: error.message });
    throw error;
  }
}

// Vérification de la connexion au lancement
pool
  .connect()
  .then(client => {
    console.log(`✅ Connected to PostgreSQL (${isDev ? "development" : "production"})`);
    client.release();
  })
  .catch(err => {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  });

module.exports = {
  query,
  pool,
};
