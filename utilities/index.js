const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the single item view HTML
 ************************************ */
Util.buildItemGrid = async function (data) {
  let grid = "";
  if (data) {
    grid = `<div id="detail-display">
      <a href="../../inv/detail/${data.inv_id}" title="View ${data.inv_make} ${data.inv_model} details">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
      </a>
      <section class="contentCar">
        <div class="saleInfo">
          <h2>
            <a href="../../inv/detail/${data.inv_id}" title="View ${data.inv_make} ${data.inv_model} details">
              ${data.inv_make} ${data.inv_model}
            </a>
          </h2>
          <p id="carPrice">$${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
          <p id="carYear">${data.inv_year}</p>
        </div>
        <div class="carInfo">
          <p>Model: ${data.inv_model}</p>
          <p>Made by: ${data.inv_make}</p>
          <p>Price: $${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
          <p>Year: ${data.inv_year}</p>
          <p>Mileage: ${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>
          <p>Color: ${data.inv_color}</p>
          <p>Description: ${data.inv_description}</p>
        </div>
      </section>
    </div>`;
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build Classification List for SELECT
 ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}" ${classification_id == row.classification_id ? "selected" : ""}>${row.classification_name}</option>`;
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies?.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      res.locals.accountData = accountData;
      res.locals.logged = true;
      next();
    });
  } else {
    next();
  }
};

/* ****************************************
 * Check Login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.logged) {
    return next();
  }
  req.flash("notice", "Please log in.");
  return res.redirect("/account/login");
};

/* ****************************************
 * Check Account Type (no Client)
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type; // sécurisation
  if (accountType && accountType !== "Client") {
    return next();
  }
  req.flash("notice", "Please log in with Authorized account.");
  return res.redirect("/account/login");
};

/* ****************************************
 * Check Account Type is Admin
 **************************************** */
Util.checkAdminAccountType = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type; // sécurisation
  if (accountType && accountType === "Admin") {
    return next();
  }
  req.flash("notice", "Please log in with Authorized account.");
  return res.redirect("/account/login");
};

module.exports = Util;
