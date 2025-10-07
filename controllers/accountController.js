// ⚠️ Charger les variables d'environnement tout en haut
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

/* =====================================================
 *  BUILD ACCOUNT MANAGEMENT VIEW
 * ===================================================== */
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/", {
      title: "Account Management",
      nav,
      errors: [],
      messages: req.flash ? req.flash() : {},
    });
  } catch (err) {
    console.error("❌ Error building account management:", err);
    next(err);
  }
}

/* =====================================================
 *  BUILD LOGIN VIEW
 * ===================================================== */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: [],
      messages: req.flash ? req.flash() : {},
      login_email: "",
    });
  } catch (err) {
    console.error("❌ Error building login view:", err);
    next(err);
  }
}

/* =====================================================
 *  BUILD REGISTER VIEW
 * ===================================================== */
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/register", {
      title: "Register",
      nav,
      errors: [],
      messages: req.flash ? req.flash() : {},
    });
  } catch (err) {
    console.error("❌ Error building register view:", err);
    next(err);
  }
}

/* =====================================================
 *  BUILD ACCOUNT UPDATE VIEW
 * ===================================================== */
async function buildAccountUpdate(req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id, 10);
    const nav = await utilities.getNav();
    const account = await accountModel.getAccountById(account_id);

    if (!account) {
      req.flash("notice", "❌ Compte introuvable.");
      return res.redirect("/account/");
    }

    res.render("./account/update", {
      title: "Edit Account",
      nav,
      errors: [],
      messages: req.flash ? req.flash() : {},
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_id: account.account_id,
    });
  } catch (err) {
    console.error("❌ Error loading update view:", err);
    next(err);
  }
}

/* =====================================================
 *  PROCESS REGISTRATION
 * ===================================================== */
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      req.flash("notice", "❌ Tous les champs sont requis.");
      return res.status(400).render("./account/register", {
        title: "Register",
        nav,
        errors: [],
        messages: req.flash(),
      });
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("success", `✅ ${account_firstname}, inscription réussie ! Connectez-vous.`);
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "❌ Échec de l'inscription.");
      return res.status(400).render("./account/register", {
        title: "Register",
        nav,
        errors: [],
        messages: req.flash(),
      });
    }
  } catch (err) {
    console.error("❌ Error registering account:", err);
    req.flash("error", "❌ Erreur serveur lors de l'inscription.");
    next(err);
  }
}

/* =====================================================
 *  PROCESS LOGIN
 * ===================================================== */
async function accountLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    if (!account_email || !account_password) {
      req.flash("notice", "❌ Email et mot de passe requis.");
      return res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: [],
        messages: req.flash(),
        login_email: account_email || "",
      });
    }

    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: [],
        messages: req.flash(),
        login_email: account_email,
      });
    }

    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      req.flash("notice", "❌ Mot de passe incorrect.");
      return res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: [],
        messages: req.flash(),
        login_email: account_email,
      });
    }

    delete accountData.account_password;

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini dans .env ⚠️");

    const token = jwt.sign(accountData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    req.flash("success", `👋 Bienvenue ${accountData.account_firstname} !`);
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error during login:", err);
    req.flash("error", "❌ Erreur serveur lors de la connexion.");
    next(err);
  }
}

/* =====================================================
 *  UPDATE ACCOUNT INFO
 * ===================================================== */
async function updateAccountInfo(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (!updateResult) {
      req.flash("notice", "❌ Échec de la mise à jour.");
      return res.status(400).render("./account/update", {
        title: "Edit Account",
        nav,
        errors: [],
        messages: req.flash(),
      });
    }

    const accountData = updateResult.rows[0];
    delete accountData.account_password;

    const token = jwt.sign(accountData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    req.flash("success", "✅ Compte mis à jour avec succès !");
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error updating account:", err);
    req.flash("error", "❌ Erreur serveur lors de la mise à jour.");
    next(err);
  }
}

/* =====================================================
 *  UPDATE PASSWORD
 * ===================================================== */
async function updatePassword(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { account_id, account_password } = req.body;

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updatePwdResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (!updatePwdResult) {
      req.flash("notice", "❌ Échec de la mise à jour du mot de passe.");
      return res.status(400).render("./account/update", {
        title: "Edit Account",
        nav,
        errors: [],
        messages: req.flash(),
      });
    }

    req.flash("success", "🔑 Mot de passe mis à jour avec succès !");
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error updating password:", err);
    req.flash("error", "❌ Erreur serveur lors de la mise à jour du mot de passe.");
    next(err);
  }
}

/* =====================================================
 *  LOGOUT
 * ===================================================== */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("success", "👋 Vous avez été déconnecté.");
  res.redirect("/");
}

/* =====================================================
 *  EXPORTS
 * ===================================================== */
module.exports = {
  buildAccountManagement,
  buildLogin,
  buildRegister,
  buildAccountUpdate,
  registerAccount,
  accountLogin,
  updateAccountInfo,
  updatePassword,
  logout,
};
