const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver Update Account view
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
  const string_account_id = req.params.account_id;
  const account_id = parseInt(string_account_id);
  let nav = await utilities.getNav();
  const account = await accountModel.getAccountById(account_id);
  res.render("./account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: account.account_id,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Log in
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Process Update Account Info
 * *************************************** */
async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re updated ${account_firstname}. Please log in.`
    );
    const accountData = updateResult.rows[0];

    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    res.locals.accountData = accountData;
    res.status(201).render("./account", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
  }
}

/* ****************************************
 *  Process Update Password
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error changing the password."
    );
    res.status(500).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
    });
  }

  const updatePwdResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updatePwdResult) {
    req.flash(
      "notice",
      `Congratulations ${updatePwdResult.rows[0].account_firstname}, your Password was updated.`
    );
    res.status(201).render("./account", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Logout
 * *************************************** */
const logout = (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("userName");
  res.redirect("/");
};

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
