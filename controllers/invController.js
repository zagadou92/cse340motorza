const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build Management View (/inv)
 *  Accessible même sans login
 * *************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    // Données utilisateur (toujours défini, même vide)
    const accountData = req.session?.user || {}

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      accountData,
      message: req.flash("notice") || null,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build inventory by classification view
 * *************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()

    const accountData = req.session?.user || {}

    const className = data.length > 0 ? data[0].classification_name : "No vehicles"

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      accountData,
      message: req.flash("notice") || null,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build detail view for a single vehicle
 * *************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.vehicleId
    const data = await invModel.getVehicleById(vehicle_id)
    const nav = await utilities.getNav()

    const accountData = req.session?.user || {}

    if (!data) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv")
    }

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
      accountData,
      message: req.flash("notice") || null,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Classification View
 * *************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const accountData = req.session?.user || {}

    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      accountData,
      message: req.flash("notice") || null,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Inventory View
 * *************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    const accountData = req.session?.user || {}

    res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications,
      accountData,
      message: req.flash("notice") || null,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
