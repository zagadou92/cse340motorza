const pool = require("../database/");

/* *****************************
 * Return users data
 * ***************************** */
async function getUsers() {
  try {
    const result = await pool.query("SELECT * FROM account");
    return result.rows;
  } catch (error) {
    console.error("No Users found error " + error);
  }
}

/* *****************************
*   Delete a user
* *************************** */
async function deleteUser(account_id) {
  try {
    const sql = "DELETE FROM account WHERE account_id = $1";
    const data = await pool.query(sql, [account_id]);
    return data;
  } catch (error) {
    new Error("Delete User Error");
  }
}

module.exports = {
  getUsers,
  deleteUser,
};
