/**
 * inventory-routes.js
 * Routes sécurisées pour l'inventaire des véhicules
 */

const express = require("express");
const router = new express.Router();

const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// ---------------------------
// Middleware sécurisé pour vérifier account_type
// ---------------------------
const safeCheckAccountType = async (req, res, next) => {
  try {
    // Vérifie que la session existe et que account_type est défini
    if (!req.session || !req.session.account_type) {
      req.flash("notice", "Access denied. Please log in.");
      return res.redirect("/account/login");
    }
    return utilities.checkAccountType(req, res, next);
  } catch (error) {
    console.error("Erreur dans safeCheckAccountType:", error);
    return res.status(500).send("Server error in account check.");
  }
};

// ---------------------------
// ROUTES GET
// ---------------------------

// Vue gestion de l’inventaire
router.get(
  "/",
  safeCheckAccountType,
  utilities.handleErrors(invController.buildVehicleManagement)
);

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
  safeCheckAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Ajouter un véhicule
router.get(
  "/add-inventory",
  safeCheckAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Editer un véhicule
router.get(
  "/edit/:inv_id",
  safeCheckAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

// Supprimer un véhicule (confirmation)
router.get(
  "/delete/:inv_id",
  safeCheckAccountType,
  utilities.handleErrors(invController.deleteView)
);

// Récupérer les données d’inventaire en JSON (AJAX)
router.get(
  "/getInventory/:classification_id",
  safeCheckAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// ---------------------------
// ROUTES POST
// ---------------------------

// Ajouter une classification
router.post(
  "/add-classification",
  safeCheckAccountType,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationName)
);

// Ajouter un nouveau véhicule
router.post(
  "/add-inventory",
  safeCheckAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

// Mettre à jour un véhicule
router.post(
  "/update/",
  safeCheckAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Supprimer un véhicule
router.post(
  "/delete",
  safeCheckAccountType,
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
