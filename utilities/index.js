const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ===============================
 * Build navigation HTML
 * =============================== */
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

/* ===============================
 * Build inventory grid
 * =============================== */
Util.buildClassificationGrid = async function (data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';
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
  return grid;
};

/* ===============================
 * Build single item grid
 * =============================== */
Util.buildItemGrid = async function (data) {
  if (!data) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  const grid = `<div id="detail-display">
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
  return grid;
};

/* ===============================
 * Build classification list
 * =============================== */
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

/* ===============================
 * Middleware: Handle async errors
 * =============================== */
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ===============================
 * Middleware: Check JWT
 * =============================== */
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

/* ===============================
 * Middleware: Check login
 * =============================== */
Util.checkLogin = (req, res, next) => {
  if (res.locals.logged) return next();
  req.flash("notice", "Please log in.");
  return res.redirect("/account/login");
};

/* ===============================
 * Middleware: Check account type (no Client)
 * =============================== */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type;
  if (accountType && accountType !== "Client") return next();
  req.flash("notice", "Please log in with an authorized account.");
  return res.redirect("/account/login");
};

/* ===============================
 * Middleware: Check Admin account
 * =============================== */
Util.checkAdminAccountType = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type;
  if (accountType === "Admin") return next();
  req.flash("notice", "Please log in with an authorized account.");
  return res.redirect("/account/login");
};

module.exports = Util;
