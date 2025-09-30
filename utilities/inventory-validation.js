const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Add Classification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .isAlpha("en-US", { allow: "" })
      .withMessage("Please provide only alphabetic characters."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to Add Classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please choose classification name."), // on error this message is sent.

    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."), // on error this message is sent.

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model name."), // on error this message is sent.

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a image path."),

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
      .withMessage("Please provide a valid miles."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid color."),
  ];
};

/* ******************************
 * Check data and return errors or continue to Add Inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
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
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors will be directed back to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
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
    return;
  }
  next();
};

module.exports = validate;