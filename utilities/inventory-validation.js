const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Add Classification Validation Rules
 ********************************** */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isAlpha("en-US", { allow: "" })
      .withMessage("Please provide only alphabetic characters."),
  ];
};

/* **********************************
 *  Check Classification Data
 ********************************** */
validate.checkClassificationData = async (req, res, next) => {
  if (!req.body) req.body = {}; // sécuriser req.body

  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
  }
  next();
};

/* **********************************
 *  Add Inventory Validation Rules
 ********************************** */
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please choose classification name."),

    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model name."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .trim()
      .escape()
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("Please provide a valid price."),

    body("inv_year")
      .trim()
      .escape()
      .matches(/^\d{4}$/)
      .withMessage("Please provide a valid year."),

    body("inv_miles")
      .trim()
      .escape()
      .matches(/^\d+$/)
      .withMessage("Please provide valid miles."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid color."),
  ];
};

/* **********************************
 *  Check Inventory Data
 ********************************** */
validate.checkInventoryData = async (req, res, next) => {
  if (!req.body) req.body = {}; // sécuriser req.body

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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    return res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
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
    });
  }
  next();
};

/* **********************************
 *  Check Update Inventory Data
 ********************************** */
validate.checkUpdateData = async (req, res, next) => {
  if (!req.body) req.body = {}; // sécuriser req.body

  const {
    classification_id,
    inv_id,
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    return res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
  next();
};

module.exports = validate;
