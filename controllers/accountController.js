// ⚠️ Charger les variables d'environnement tout en haut
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

// =======================================
// Deliver Account Management View
// =======================================
async function buildAccountManagement(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/", { title: "Account Management", nav, errors: null });
  } catch (err) {
    console.error("❌ Error building account management:", err);
    res.status(500).send("Server Error");
  }
}

// =======================================
// Deliver Login View
// =======================================
async function buildLogin(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/login", { title: "Login", nav, errors: null });
  } catch (err) {
    console.error("❌ Error building login view:", err);
    res.status(500).send("Server Error");
  }
}

// =======================================
// Deliver Register View
// =======================================
async function buildRegister(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("./account/register", { title: "Register", nav, errors: null });
  } catch (err) {
    console.error("❌ Error building register view:", err);
    res.status(500).send("Server Error");
  }
}

// =======================================
// Deliver Update Account View
// =======================================
async function buildAccountUpdate(req, res) {
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
      errors: null,
      ...account,
    });
  } catch (err) {
    console.error("❌ Error loading update view:", err);
    res.status(500).send("Server Error");
  }
}

// =======================================
// Process Registration
// =======================================
async function registerAccount(req, res) {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      req.flash("notice", "❌ Tous les champs sont requis.");
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
      req.flash("notice", `✅ ${account_firstname}, inscription réussie ! Connectez-vous.`);
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "❌ Échec de l'inscription.");
      return res.status(400).render("./account/register", { title: "Register", nav, errors: null });
    }
  } catch (err) {
    console.error("❌ Error registering account:", err);
    req.flash("notice", "❌ Erreur serveur lors de l'inscription.");
    res.status(500).render("./account/register", { title: "Register", nav, errors: null });
  }
}

// =======================================
// Process Login
// =======================================
async function accountLogin(req, res) {
  try {
    const nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    if (!account_email || !account_password) {
      req.flash("notice", "❌ Email et mot de passe requis.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null });
    }

    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null });
    }

    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null });
    }

    delete accountData.account_password;

    if (!process.env.JWT_SECRET) throw new Error("JWT secret non défini");

    const token = jwt.sign(accountData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    req.flash("notice", `👋 Bienvenue ${accountData.account_firstname} !`);
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error login:", err);
    req.flash("notice", "❌ Erreur serveur lors de la connexion.");
    res.status(500).render("./account/login", { title: "Login", nav: [], errors: null });
  }
}

// =======================================
// Update Account Info
// =======================================
async function updateAccountInfo(req, res) {
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
      return res.status(400).render("./account/update", { title: "Edit Account", nav, errors: null });
    }

    const accountData = updateResult.rows[0];
    delete accountData.account_password;

    const token = jwt.sign(accountData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "1h" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    req.flash("notice", "✅ Compte mis à jour avec succès !");
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error updating account:", err);
    req.flash("notice", "❌ Erreur serveur lors de la mise à jour.");
    res.status(500).render("./account/update", { title: "Edit Account", nav: [], errors: null });
  }
}

// =======================================
// Update Password
// =======================================
async function updatePassword(req, res) {
  try {
    const nav = await utilities.getNav();
    const { account_id, account_password } = req.body;

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updatePwdResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (!updatePwdResult) {
      req.flash("notice", "❌ Échec de la mise à jour du mot de passe.");
      return res.status(400).render("./account/update", { title: "Edit Account", nav, errors: null });
    }

    req.flash("notice", "🔑 Mot de passe mis à jour avec succès !");
    return res.redirect("/account/");
  } catch (err) {
    console.error("❌ Error updating password:", err);
    req.flash("notice", "❌ Erreur serveur lors de la mise à jour du mot de passe.");
    res.status(500).render("./account/update", { title: "Edit Account", nav, errors: null });
  }
}

// =======================================
// Logout
// =======================================
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "👋 Vous avez été déconnecté.");
  res.redirect("/");
}

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
