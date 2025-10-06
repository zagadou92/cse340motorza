const pool = require("../database/");

/* ********************************************
 *  Register a new account
 * ******************************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email.toLowerCase().trim(),
      account_password
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error in registerAccount:", error.message);
    throw new Error("Database error during registration.");
  }
}

/* ********************************************
 *  Check if an email already exists
 * ******************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT 1 FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email.toLowerCase().trim()]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ Error in checkExistingEmail:", error.message);
    throw new Error("Database error while checking email.");
  }
}

/* ********************************************
 *  Check if email exists excluding current account
 * ******************************************** */
async function checkExistingEmailExcludingCurrent(account_email, account_id) {
  try {
    const sql = `
      SELECT 1 FROM account
      WHERE account_email = $1 AND account_id != $2
    `;
    const result = await pool.query(sql, [account_email.toLowerCase().trim(), account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ Error in checkExistingEmailExcludingCurrent:", error.message);
    throw new Error("Database error while checking email uniqueness.");
  }
}

/* ********************************************
 *  Get account data by email
 * ******************************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, 
             account_email, account_type, account_password
      FROM account
      WHERE account_email = $1
    `;
    const result = await pool.query(sql, [account_email.toLowerCase().trim()]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ Error in getAccountByEmail:", error.message);
    throw new Error("Database error while retrieving account by email.");
  }
}

/* ********************************************
 *  Get account data by ID
 * ******************************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname,
             account_email, account_type, account_password
      FROM account
      WHERE account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ Error in getAccountById:", error.message);
    throw new Error("Database error while retrieving account by ID.");
  }
}

/* ********************************************
 *  Update Account Info
 * ******************************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `;
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email.toLowerCase().trim(),
      account_id
    ]);
    return result.rowCount ? result : null;
  } catch (error) {
    console.error("❌ Error in updateAccountInfo:", error.message);
    throw new Error("Database error while updating account info.");
  }
}

/* ********************************************
 *  Update Account Password
 * ******************************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id, account_email
    `;
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rowCount ? result : null;
  } catch (error) {
    console.error("❌ Error in updatePassword:", error.message);
    throw new Error("Database error while updating password.");
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
