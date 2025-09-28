const invModel = require("../models/invModel");
const utilities = require("../utilities");

const invController = {};

// Show inventory management view
invController.showManagement = async (req, res) => {
  try {
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/index", {
      title: "Inventory Management",
      classificationSelect,
      messages: req.flash()
    });
  } catch (error) {
    console.error("Error in showManagement:", error);
    res.status(500).send("Server error while loading inventory management.");
  }
};

// Show add classification form
invController.showAddClassification = (req, res) => {
  try {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      messages: req.flash()
    });
  } catch (error) {
    console.error("Error in showAddClassification:", error);
    res.status(500).send("Server error while loading add classification form.");
  }
};

// Add new classification
invController.addClassification = async (req, res) => {
  try {
    const { classification_name } = req.body;
    if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
      req.flash("error", "Invalid classification name. Only letters and numbers are allowed.");
      return res.redirect("/inv/add-classification");
    }
    await invModel.insertClassification(classification_name);
    req.flash("success", "Classification added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    console.error("Error in addClassification:", error);
    req.flash("error", "Server error: Could not add classification.");
    res.redirect("/inv/add-classification");
  }
};

// Show add vehicle form
invController.showAddInventory = async (req, res) => {
  try {
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      classificationSelect,
      messages: req.flash()
    });
  } catch (error) {
    console.error("Error in showAddInventory:", error);
    res.status(500).send("Server error while loading add vehicle form.");
  }
};

// Add new vehicle
invController.addVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;
    await invModel.insertVehicle(vehicleData);
    req.flash("success", "Vehicle added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    console.error("Error in addVehicle:", error);
    req.flash("error", "Server error: Could not add vehicle.");
    res.redirect("/inv/add-inventory");
  }
};

// Get inventory as JSON for AJAX
invController.getInventoryJSON = async (req, res) => {
  try {
    const vehicles = await invModel.getVehiclesByClassification(req.params.classification_id);
    res.json(vehicles);
  } catch (error) {
    console.error("Error in getInventoryJSON:", error);
    res.status(500).json({ error: "Server error retrieving inventory." });
  }
};

module.exports = invController;
