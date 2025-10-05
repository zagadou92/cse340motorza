// inventoryRoute.js

const express = require("express");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const requireEmployeeOrAdmin = require("../middleware/authMiddleware"); // 🔹 notre middleware JWT + type compte

const router = express.Router();

/* ==============================
   Routes publiques
   ============================== */

// Affiche tous les véhicules d’une classification (accessible aux visiteurs)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Affiche le détail d’un véhicule (accessible aux visiteurs)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildItemByInvId)
);

/* ==============================
   Routes protégées (Employé ou Admin)
   ============================== */

// Vue gestion des véhicules
router.get(
  "/",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildVehicleManagement)
);

// Ajouter une nouvelle classification
router.get(
  "/add-classification",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

// Ajouter un nouveau véhicule
router.get(
  "/add-inventory",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

// Récupération JSON de l’inventaire pour AJAX
router.get(
  "/getInventory/:classification_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Modifier un véhicule
router.get(
  "/edit/:inv_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
);

/* ==============================
   Routes POST protégées
   ============================== */

// Ajouter une classification
router.post(
  "/add-classification",
  requireEmployeeOrAdmin,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationName)
);

// Ajouter un véhicule
router.post(
  "/add-inventory",
  requireEmployeeOrAdmin,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

// Mettre à jour un véhicule
router.post(
  "/update/",
  requireEmployeeOrAdmin,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Affichage confirmation suppression
router.get(
  "/delete/:inv_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteView)
);

// Supprimer un véhicule
router.post(
  "/delete",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;
