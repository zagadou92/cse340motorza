// ⚠️ Charger les variables d'environnement dès le début
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    // Vérifie que les champs sont remplis
    if (!account_email || !account_password) {
      req.flash("notice", "❌ Email et mot de passe sont requis.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // Récupère le compte dans la base
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // Vérifie le mot de passe
    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // Supprime le mot de passe avant de créer le token
    delete accountData.account_password;

    // Vérifie que JWT_SECRET est défini
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET n'est pas défini dans .env");
      throw new Error("JWT secret non défini");
    }

    // Crée le token JWT
    const accessToken = jwt.sign(accountData, secret, { expiresIn: process.env.JWT_EXPIRY || "1h" });

    // Stocke le token dans un cookie sécurisé
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    req.flash("notice", `👋 Bienvenue ${accountData.account_firstname} !`);
    return res.redirect("/account/");

  } catch (err) {
    console.error("❌ Erreur login :", err);
    req.flash("notice", "❌ Erreur serveur lors de la connexion.");
    return res.status(500).render("./account/login", { title: "Login", nav, errors: null, account_email });
  }
}

module.exports = {
  accountLogin,
};
