const invValidate = require("../utilities/inventory-validation");

// Needed Resources
const express = require("express");
const utilities = require("../utilities/");

const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
// Route to build single item view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildItemByInvId)
);

// Route to build vehicle management view
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildVehicleManagement)
);

// Route sent when the "Add New Classification" link is clicked
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route sent when the "Add New Vehicle" link is clicked
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to get the inventory data as JSON for AJAX Route
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route sent when the "Edit New Vehicle" link is clicked
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

// Route to post "Add Classification Name" to database
router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationName)
);

// Route to post "Add New Vehicle" to database
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

// Route to post "Update Vehicle" to database
router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Deliver the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteView)
);

// Process the delete inventory request
router.post(
  "/delete",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
