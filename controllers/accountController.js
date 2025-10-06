const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
require("dotenv").config();

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } catch (err) {
    console.error("❌ Error building account management:", err.message);
    res.status(500).send("Server Error");
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver Update Account view
 * *************************************** */
async function buildAccountUpdate(req, res) {
  try {
    const account_id = parseInt(req.params.account_id);
    const nav = await utilities.getNav();
    const account = await accountModel.getAccountById(account_id);

    if (!account) {
      req.flash("notice", "❌ Account not found.");
      return res.redirect("/account/");
    }

    res.render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      ...account, // account_firstname, account_lastname, etc.
    });
  } catch (err) {
    console.error("❌ Error loading update view:", err.message);
    res.status(500).send("Server Error");
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existing = await accountModel.checkExistingEmail(account_email);
    if (existing > 0) {
      req.flash("notice", "❌ Email already in use.");
      return res.status(400).render("./account/register", { title: "Register", nav, errors: null });
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `✅ Registration successful. Welcome, ${account_firstname}! Please log in.`);
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "❌ Registration failed. Try again.");
      return res.status(400).render("./account/register", { title: "Register", nav, errors: null });
    }
  } catch (err) {
    console.error("❌ Error registering account:", err.message);
    req.flash("notice", "Server error during registration.");
    res.status(500).render("./account/register", { title: "Register", nav, errors: null });
  }
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "❌ Invalid credentials.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      req.flash("notice", "❌ Incorrect password.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // Supprimer le mot de passe avant de créer le token
    delete accountData.account_password;

    // Vérifier que la clé secrète JWT est définie
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    // Créer JWT token
    const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "1h" });

    // Définir le cookie sécurisé
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseJwtExpiry(process.env.JWT_EXPIRY) || 3600 * 1000,
    });

    req.flash("notice", `👋 Welcome back, ${accountData.account_firstname}!`);
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error logging in:", err.message);
    req.flash("notice", "Server error during login.");
    res.status(500).render("./account/login", { title: "Login", nav, errors: null });
  }
}

/* ****************************************
 *  Helper pour convertir JWT_EXPIRY en ms
 * *************************************** */
function parseJwtExpiry(exp) {
  if (!exp) return null;
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

/* ****************************************
 *  Process Update Account Info
 * *************************************** */
async function updateAccountInfo(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  try {
    const updateResult = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

    if (!updateResult) {
      req.flash("notice", "❌ Update failed.");
      return res.status(400).render("./account/update", { title: "Edit Account", nav, errors: null });
    }

    const accountData = updateResult.rows[0];
    delete accountData.account_password;

    const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "1h" });
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseJwtExpiry(process.env.JWT_EXPIRY) || 3600 * 1000,
    });

    req.flash("notice", "✅ Account updated successfully.");
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error updating account:", err.message);
    req.flash("notice", "Server error during update.");
    res.status(500).render("./account/update", { title: "Edit Account", nav, errors: null });
  }
}

/* ****************************************
 *  Process Update Password
 * *************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updatePwdResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updatePwdResult) {
      req.flash("notice", "🔑 Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "❌ Failed to update password.");
      res.status(400).render("./account/update", { title: "Edit Account", nav, errors: null });
    }
  } catch (err) {
    console.error("❌ Error updating password:", err.message);
    req.flash("notice", "Server error during password update.");
    res.status(500).render("./account/update", { title: "Edit Account", nav, errors: null });
  }
}

/* ****************************************
 *  Process Logout
 * *************************************** */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "👋 You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logout,
  buildAccountUpdate,
  updateAccountInfo,
  updatePassword,
};
