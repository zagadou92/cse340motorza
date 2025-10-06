const pool = require("../database");

/* ****************************************
 * Register new account
 * **************************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  const sql = `
    INSERT INTO account (
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password, 
      account_type
    )
    VALUES ($1, $2, $3, $4, 'Client')
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type;
  `;
  try {
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ registerAccount error:", error);
    throw new Error("Database error during registration");
  }
}

/* ****************************************
 * Check if email already exists
 * **************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_id FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ checkExistingEmail error:", error);
    throw new Error("Database error during email check");
  }
}

/* ****************************************
 * Check if email exists excluding current account
 * **************************************** */
async function checkExistingEmailExcludingCurrent(account_email, account_id) {
  try {
    const sql = `
      SELECT account_id 
      FROM account 
      WHERE account_email = $1 AND account_id != $2
    `;
    const result = await pool.query(sql, [account_email, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ checkExistingEmailExcludingCurrent error:", error);
    throw new Error("Database error during email check");
  }
}

/* ****************************************
 * Get account by email
 * **************************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type, 
        account_password 
      FROM account 
      WHERE account_email = $1
    `;
    const result = await pool.query(sql, [account_email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ getAccountByEmail error:", error);
    throw new Error("Database error while retrieving account by email");
  }
}

/* ****************************************
 * Get account by ID
 * **************************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type 
      FROM account 
      WHERE account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ getAccountById error:", error);
    throw new Error("Database error while retrieving account by ID");
  }
}

/* ****************************************
 * Update account info
 * **************************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  const sql = `
    UPDATE account 
    SET 
      account_firstname = $1, 
      account_lastname = $2, 
      account_email = $3
    WHERE account_id = $4
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type;
  `;
  try {
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ updateAccountInfo error:", error);
    throw new Error("Database error while updating account info");
  }
}

/* ****************************************
 * Update account password
 * **************************************** */
async function updatePassword(account_id, account_password) {
  const sql = `
    UPDATE account 
    SET account_password = $1 
    WHERE account_id = $2
    RETURNING account_id, account_firstname, account_lastname, account_email;
  `;
  try {
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ updatePassword error:", error);
    throw new Error("Database error while updating password");
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  checkExistingEmailExcludingCurrent,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword,
};
