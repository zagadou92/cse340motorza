// =====================================================
// ⚙️ Configuration
// =====================================================
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

// =====================================================
// 🧩 Helper – sécurise les flash messages
// =====================================================
function getMessages(req) {
  try {
    const msgs = req.flash ? req.flash() : {};
    return {
      success: msgs.success || [],
      error: msgs.error || [],
      notice: msgs.notice || [],
    };
  } catch {
    return { success: [], error: [], notice: [] };
  }
}

// =====================================================
// 🔐 Hash password helper
// =====================================================
async function hashPassword(password) {
  if (!password || password.length < 12) {
    throw new Error("Password must be at least 12 characters");
  }
  return await bcrypt.hash(password, 10);
}

// =====================================================
// 🔑 JWT helper
// =====================================================
function signToken(accountData) {
  const token = jwt.sign(accountData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1h",
  });
  return token;
}

// =====================================================
// 📂 BUILD VIEWS
// =====================================================
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/", {
      title: "Account Management",
      nav,
      errors: [],
      messages: getMessages(req),
    });
  } catch (err) {
    console.error("❌ Error building account management:", err);
    next(err);
  }
}

async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: [],
      messages: getMessages(req),
      login_email: "",
    });
  } catch (err) {
    console.error("❌ Error building login view:", err);
    next(err);
  }
}

async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/register", {
      title: "Register",
      nav,
      errors: [],
      messages: getMessages(req),
    });
  } catch (err) {
    console.error("❌ Error building register view:", err);
    next(err);
  }
}

// =====================================================
// 🧾 REGISTER ACCOUNT
// =====================================================
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      req.flash("notice", "❌ Tous les champs sont requis.");
      return res.status(400).render("./account/register", { title: "Register", nav, errors: [], messages: getMessages(req) });
    }

    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount) {
      req.flash("notice", "⚠️ Cet email est déjà utilisé. Essayez de vous connecter.");
      return res.redirect("/account/login");
    }

    const hashedPassword = await hashPassword(account_password);
    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);

    if (regResult) {
      req.flash("success", `✅ ${account_firstname}, inscription réussie ! Connectez-vous.`);
      return res.redirect("/account/login");
    }

    req.flash("error", "❌ Une erreur est survenue lors de l'inscription.");
    return res.status(400).render("./account/register", { title: "Register", nav, errors: [], messages: getMessages(req) });

  } catch (err) {
    console.error("❌ Error registering account:", err);
    req.flash("error", "❌ Erreur serveur lors de l'inscription.");
    next(err);
  }
}

// =====================================================
// 🔐 ACCOUNT LOGIN
// =====================================================
async function accountLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    if (!account_email || !account_password) {
      req.flash("notice", "❌ Email et mot de passe requis.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: [], messages: getMessages(req), login_email: account_email || "" });
    }

    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: [], messages: getMessages(req), login_email: account_email });
    }

    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      req.flash("notice", "❌ Mot de passe incorrect.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: [], messages: getMessages(req), login_email: account_email });
    }

    delete accountData.account_password;
    const token = signToken(accountData);

    res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 }); // 24h

    req.flash("success", `👋 Bienvenue ${accountData.account_firstname} !`);
    return res.redirect("/account/");

  } catch (err) {
    console.error("❌ Error during login:", err);
    req.flash("error", "❌ Erreur serveur lors de la connexion.");
    next(err);
  }
}

// =====================================================
// 🚪 LOGOUT
// =====================================================
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("success", "👋 Vous avez été déconnecté.");
  res.redirect("/");
}

module.exports = {
  buildAccountManagement,
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logout,
};
