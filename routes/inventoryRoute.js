/**
 * inventory-routes.js
 * Routes pour l'inventaire des véhicules, accessibles pour tous
 */

const express = require("express");
const router = new express.Router();

const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// ---------------------------
// ROUTES GET
// ---------------------------

// Route principale /inv/ → Vehicle Management
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Vue par classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Vue d’un véhicule
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildItemByInvId)
);

// Ajouter une classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Ajouter un véhicule
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Editer un véhicule
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory)
);

// Supprimer un véhicule (confirmation)
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteView)
);

// Récupérer les données d’inventaire en JSON (AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// ---------------------------
// ROUTES POST
// ---------------------------

// Ajouter une classification
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationName)
);

// Ajouter un nouveau véhicule
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

// Mettre à jour un véhicule
router.post(
  "/update/",
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Supprimer un véhicule
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
