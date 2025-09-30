const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    const className = data.length > 0 ? data[0].classification_name : "Vehicles";

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      isAdmin: res.locals.accountData?.account_type !== undefined
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build single item view
 * ************************** */
invCont.buildItemByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getItemByInvId(inv_id);
    if (!data) {
      return res.status(404).send("Vehicle not found");
    }
    const grid = await utilities.buildItemGrid(data);
    const nav = await utilities.getNav();

    const carTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

    res.render("./inventory/detail", {
      title: carTitle,
      nav,
      grid,
      isAdmin: res.locals.accountData?.account_type !== undefined
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle management view (admin only)
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    const pageTitle = "Vehicle Management";

    res.render("./inventory", {
      title: pageTitle,
      nav,
      classificationSelect,
      errors: null,
      isAdmin: res.locals.accountData?.account_type !== undefined
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
      isAdmin: res.locals.accountData?.account_type !== undefined
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
      isAdmin: res.locals.accountData?.account_type !== undefined
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Add Classification Name (Admin)
 * *************************************** */
invCont.addClassificationName = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const { classification_name } = req.body;
    const classificationSelect = await utilities.buildClassificationList();

    const classResult = await invModel.registerClassification(classification_name);

    if (classResult) {
      req.flash("notice", `Congratulations, ${classification_name} was added.`);
      return res.status(201).render("./inventory", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        errors: null,
        isAdmin: true
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        classificationSelect,
        errors: null,
        isAdmin: true
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ****************************************
 *  Add New Vehicle (Admin)
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

    const new_price = Number(inv_price);
    const new_miles = Number(inv_miles);

    const classResult = await invModel.registerVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      new_price,
      inv_year,
      new_miles,
      inv_color
    );

    if (classResult) {
      req.flash("notice", `Congratulations, ${inv_make} was added.`);
      return res.status(201).render("./inventory", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        errors: null,
        isAdmin: true
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationSelect,
        errors: null,
        isAdmin: true
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ****************************************
 *  Export controller
 * *************************************** */
module.exports = invCont;
