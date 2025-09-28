const invModel = require("../models/invModel");
const utilities = require("../utilities");

const invController = {};

// Management view - protected
invController.showManagement = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, async () => {
      const classificationSelect = await utilities.buildClassificationList();
      res.render("inventory/index", {
        title: "Inventory Management",
        classificationSelect,
        messages: req.flash()
      });
    });
  } catch (error) {
    console.error("Error in showManagement:", error);
    res.status(500).send("Server error in inventory management.");
  }
};

// Add Classification view - protected
invController.showAddClassification = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, () => {
      res.render("inventory/add-classification", { 
        title: "Add Classification", 
        messages: req.flash() 
      });
    });
  } catch (error) {
    console.error("Error in showAddClassification:", error);
    res.status(500).send("Server error in add classification.");
  }
};

// Add Classification - protected
invController.addClassification = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, async () => {
      const { classification_name } = req.body;
      if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
        req.flash("error", "Invalid classification name.");
        return res.redirect("/inv/add-classification");
      }
      await invModel.insertClassification(classification_name);
      req.flash("success", "Classification added successfully!");
      res.redirect("/inv/");
    });
  } catch (error) {
    console.error("Error in addClassification:", error);
    res.status(500).send("Server error adding classification.");
  }
};

// Add Inventory view - protected
invController.showAddInventory = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, async () => {
      const classificationSelect = await utilities.buildClassificationList();
      res.render("inventory/add-inventory", { 
        title: "Add Vehicle", 
        classificationSelect, 
        messages: req.flash() 
      });
    });
  } catch (error) {
    console.error("Error in showAddInventory:", error);
    res.status(500).send("Server error in add inventory view.");
  }
};

// Add Vehicle - protected
invController.addVehicle = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, async () => {
      const vehicleData = req.body;
      await invModel.insertVehicle(vehicleData);
      req.flash("success", "Vehicle added successfully!");
      res.redirect("/inv/");
    });
  } catch (error) {
    console.error("Error in addVehicle:", error);
    res.status(500).send("Server error adding vehicle.");
  }
};

// Get inventory JSON - protected
invController.getInventoryJSON = async (req, res, next) => {
  try {
    await utilities.safeCheckAccountType(req, res, async () => {
      const vehicles = await invModel.getVehiclesByClassification(req.params.classification_id);
      res.json(vehicles);
    });
  } catch (error) {
    console.error("Error in getInventoryJSON:", error);
    res.status(500).send("Server error retrieving inventory.");
  }
};

module.exports = invController;
