const usersModel = require("../models/users-model");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");

const usersCont = {};

/* ***************************
 *  Build vehicle management view
 * ************************** */
usersCont.buildUsersManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const pageTitle = "Users Management";
  res.render("./users", {
    title: pageTitle,
    nav,
    errors: null,
  });
};

/* ***************************
 *  Return Users As JSON
 * ************************** */
usersCont.getUsersJSON = async (req, res, next) => {
  const usersData = await usersModel.getUsers();
  if (usersData[0].account_id) {
    return res.json(usersData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 *  Deliver delete confirmation view
 * *************************************** */
usersCont.deleteView = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const itemData = await accountModel.getAccountById(account_id);
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`;
  res.render("./users/delete-confirm", {
    title: "Delete User: " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
    account_type: itemData.account_type,
  });
};

/* ****************************************
 *  Process delete User
 * *************************************** */
usersCont.deleteUser = async function (req, res, next) {
  const { account_id } = req.body;
  const deleteResult = await usersModel.deleteUser(account_id);
  if (deleteResult) {
    req.flash("notice", "The deletion was successful.");
    res.redirect("/users/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/users/");
  }
};

/* ****************************************
 *  Deliver Update User view
 * *************************************** */
usersCont.buildUserUpdate = async function (req, res, next) {
  const string_account_id = req.params.account_id;
  const account_id = parseInt(string_account_id);
  let nav = await utilities.getNav();
  const account = await accountModel.getAccountById(account_id);
  res.render("./users/update", {
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
 *  Process Update User Info
 * *************************************** */
usersCont.updateUserInfo = async function (req, res) {
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
      `Congratulations info user: ${account_firstname} ${account_lastname} was updated.`
    );
    res.status(201).render("./users", {
      title: "Users Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./users/update", {
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
 *  Process Update User Password
 * *************************************** */
usersCont.updatePassword = async function (req, res) {
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
      account_id,
    });
  }

  const updatePwdResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updatePwdResult) {
    req.flash(
      "notice",
      `Congratulations Password was updated in user: ${updatePwdResult.rows[0].account_firstname}.`
    );
    res.status(201).render("./users", {
      title: "Users Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./users/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    });
  }
}

module.exports = usersCont;
