// ⚠️ Charger les modules nécessaires
const express = require("express");
const router = express.Router();

const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");

// ------------------------------
// Account Management View (GET /account/)
// ------------------------------
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ------------------------------
// Login View (GET /account/login)
// ------------------------------
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// ------------------------------
// Registration View (GET /account/register)
// ------------------------------
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// ------------------------------
// Process Registration (POST /account/register)
// ------------------------------
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// ------------------------------
// Update Account View (GET /account/update/:account_id)
// ------------------------------
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// ------------------------------
// Post Edit Account Info (POST /account/update/info)
// ------------------------------
router.post(
  "/update/info",
  accountValidate.updateInfoRules(),
  accountValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// ------------------------------
// Post Edit Password (POST /account/update/password)
// ------------------------------
router.post(
  "/update/password",
  accountValidate.updatePwdRules(),
  accountValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

// ------------------------------
// Process Login (POST /account/login)
// ------------------------------
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

// ------------------------------
// Logout (GET /account/logout)
// ------------------------------
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
);

module.exports = router;
