const express = require("express");
const router = express.Router();

const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// Routes GET
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildItemByInvId));
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildVehicleManagement));
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory));
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView));

// Routes POST
router.post("/add-classification",
    utilities.checkAccountType,
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassificationName)
);

router.post("/add-inventory",
    utilities.checkAccountType,
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewVehicle)
);

router.post("/update/",
    utilities.checkAccountType,
    invValidate.addInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.post("/delete",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
