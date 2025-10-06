const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
require("dotenv").config();

async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    // 1️⃣ Vérifie que le champ email et password est rempli
    if (!account_email || !account_password) {
      req.flash("notice", "❌ Email et mot de passe sont requis.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // 2️⃣ Récupère les données du compte depuis la base
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      console.log("❌ Aucun compte trouvé pour :", account_email);
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // 3️⃣ Vérifie le mot de passe
    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!validPassword) {
      console.log("❌ Mot de passe incorrect pour :", account_email);
      req.flash("notice", "❌ Identifiants incorrects.");
      return res.status(400).render("./account/login", { title: "Login", nav, errors: null, account_email });
    }

    // 4️⃣ Supprime le mot de passe avant de créer le token
    delete accountData.account_password;

    // 5️⃣ Vérifie que la variable d'environnement JWT_SECRET est bien définie
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET n'est pas défini dans .env");
      throw new Error("JWT secret non défini");
    }

    // 6️⃣ Crée le token JWT
    const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    // 7️⃣ Stocke le token dans un cookie sécurisé
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    });

    console.log("✅ Login réussi pour :", account_email);
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
