// Needed Resources
const express = require("express");
const utilities = require("../utilities/");
const accountValidate = require("../utilities/account-validation");
const router = new express.Router();
const usersController = require("../controllers/usersController");

// Route to build users management view
router.get(
  "/",
  utilities.checkAdminAccountType,
  utilities.handleErrors(usersController.buildUsersManagement)
);

// Route to get the users data as JSON for AJAX Route
router.get(
  "/get-users",
  utilities.checkAdminAccountType,
  utilities.handleErrors(usersController.getUsersJSON)
);

// Deliver the delete confirmation view
router.get(
  "/delete/:account_id",
  utilities.checkAdminAccountType,
  utilities.handleErrors(usersController.deleteView)
);

// Process the delete inventory request
router.post(
  "/delete",
  utilities.checkAdminAccountType,
  utilities.handleErrors(usersController.deleteUser)
);

// Route sent to User Update View
router.get(
  "/update/:account_id",
  utilities.checkAdminAccountType,
  utilities.handleErrors(usersController.buildUserUpdate)
);

// Route to post Edit User Info
router.post(
  "/update/info",
  accountValidate.updateInfoRules(),
  accountValidate.checkUpdateInfoData,
  utilities.handleErrors(usersController.updateUserInfo)
);

// Route to post Edit Users Password
router.post(
  "/update/password",
  accountValidate.updatePwdRules(),
  accountValidate.checkUpdatePassword,
  utilities.handleErrors(usersController.updatePassword)
);

module.exports = router;
