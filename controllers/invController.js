const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");

const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (!data || data.length === 0) {
      return res.status(404).render("errors/404", { message: "No inventory found." });
    }
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown Classification";
    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build item by inventory id view
 * ************************** */
invCont.buildItemByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getItemByInvId(inv_id);
    if (!data) {
      return res.status(404).render("errors/404", { message: "Vehicle not found." });
    }
    const grid = await utilities.buildItemGrid(data);
    const nav = await utilities.getNav();
    const carTitle = `${data.inv_year || ""} ${data.inv_make || ""} ${data.inv_model || ""}`.trim();
    res.render("./inventory/detail", {
      title: carTitle || "Vehicle Detail",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    const pageTitle = "Vehicle Management";
    res.render("./inventory/gestion", {
      title: pageTitle,
      nav,
      errors: null,
      classificationSelect,
      message: req.flash("notice") || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver Add New Classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("notice") || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver Add New Vehicle view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
      classificationList,
      message: req.flash("notice") || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process to Add Classification Name
 * *************************************** */
invCont.addClassificationName = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    const { classification_name } = req.body;

    if (!classification_name || classification_name.trim() === "") {
      req.flash("notice", "Classification name cannot be empty.");
      return res.status(400).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        classificationSelect,
      });
    }

    const classResult = await invModel.registerClassification(classification_name);

    if (classResult) {
      req.flash("notice", `Congratulations, ${classification_name} was added as Classification Name.`);
      res.status(201).render("./inventory/gestion", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        classificationSelect,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "An error occurred.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classificationSelect: [],
    });
  }
};

/* ****************************************
 *  Process to Add New Vehicle
 * *************************************** */
invCont.addNewVehicle = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    // Vérifications de base pour éviter undefined
    if (!classification_id || !inv_make || !inv_model) {
      req.flash("notice", "Classification, Make and Model are required.");
      return res.status(400).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList: classificationSelect,
        errors: null,
        ...req.body,
      });
    }

    const new_price = Number(inv_price) || 0;
    const new_miles = Number(inv_miles) || 0;

    const classResult = await invModel.registerVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image || "no-image.png",
      inv_thumbnail || "no-thumbnail.png",
      new_price,
      inv_year || 0,
      new_miles,
      inv_color || ""
    );

    if (classResult) {
      req.flash("notice", `Congratulations, ${inv_make} was added as a vehicle.`);
      res.status(201).render("./inventory/gestion", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList: classificationSelect,
        errors: null,
        ...req.body,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "An error occurred.");
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList: [],
      errors: null,
      ...req.body,
    });
  }
};

module.exports = invController;
