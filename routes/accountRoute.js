// ⚠️ Charger les modules nécessaires
const express = require("express");
const router = new express.Router();

const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");

// ------------------------------
// Account Management View
// ------------------------------
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ------------------------------
// Login View
// ------------------------------
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// ------------------------------
// Register View
// ------------------------------
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);


// ------------------------------
// Update Account View
// ------------------------------
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// ------------------------------
// Post Edit Account Info
// ------------------------------
router.post(
  "/update/info",
  accountValidate.updateInfoRules(),
  accountValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// ------------------------------
// Post Edit Password
// ------------------------------
router.post(
  "/update/password",
  accountValidate.updatePwdRules(),
  accountValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

// ------------------------------
// Post Registration
// ------------------------------
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// ------------------------------
// Post Login
// ------------------------------
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

// ------------------------------
// Logout
// ------------------------------
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
);

module.exports = router;
