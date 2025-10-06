// ==============================
// Account Routes - Secure Version
// ==============================
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");
const jwt = require("jsonwebtoken");

// ==============================
// Middleware JWT pour routes protégées
// ==============================
function requireAuth(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("notice", "❌ Vous devez être connecté.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    req.flash("notice", "❌ Session invalide. Veuillez vous reconnecter.");
    return res.redirect("/account/login");
  }
}

// ==============================
// Account Management View
// ==============================
router.get(
  "/",
  requireAuth,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ==============================
// Login & Register Views
// ==============================
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// ==============================
// Account Update View
// ==============================
router.get(
  "/update/:account_id",
  requireAuth,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// ==============================
// POST: Edit Account Info
// ==============================
router.post(
  "/update/info",
  requireAuth,
  accountValidate.updateInfoRules(),
  accountValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// ==============================
// POST: Edit Account Password
// ==============================
router.post(
  "/update/password",
  requireAuth,
  accountValidate.updatePwdRules(),
  accountValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

// ==============================
// POST: Registration
// ==============================
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// ==============================
// POST: Login
// ==============================
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
