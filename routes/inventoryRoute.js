const express = require("express");
const router = new express.Router();

// Utilities & Validation
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Controllers
const invController = require("../controllers/invController");

// ===== PUBLIC ROUTES =====
// View inventory by classification (public)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// View single item (public)
router.get("/detail/:invId", utilities.handleErrors(invController.buildItemByInvId));
// Public inventory listing
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// ===== ADMIN / PROTECTED ROUTES =====
router.get("/admin",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildVehicleManagement)
);

router.get("/add-classification",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.buildAddClassification)
);

router.get("/add-inventory",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.buildAddInventory)
);

router.get("/edit/:inv_id",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.buildEditInventory)
);

router.get("/delete/:inv_id",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.deleteView)
);

router.get("/getInventory/:classification_id",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.getInventoryJSON)
);

// ===== POST ROUTES =====
router.post("/add-classification",
  utilities.checkJWTToken,
  
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationName)
);

router.post("/add-inventory",
  utilities.checkJWTToken,
  
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

router.post("/update/",
  utilities.checkJWTToken,
  
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.post("/delete",
  utilities.checkJWTToken,
  
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
