 require("dotenv").config(); // Charger les variables d'environnement

/* ******************************************
 * Require Statements
 ******************************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);

const pool = require("./database/");
const utilities = require("./utilities");
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const usersRoute = require("./routes/usersRoute");
const accountController = require("./controllers/accountController");

const app = express();

/* ******************************************
 * View Engine and Layouts
 ******************************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ******************************************
 * Middleware
 ******************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// JWT check
app.use(utilities.checkJWTToken);

// Expose cookies to views
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

/* ******************************************
 * Routes
 ******************************************/
app.use(staticRoutes);

// Home page
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Users routes
app.use("/users", usersRoute);

// Logout route
app.post("/logout", utilities.handleErrors(accountController.logout));

/* ******************************************
 * 404 Handler - must be last route
 ******************************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page 🥹." });
});

/* ******************************************
 * Global Error Handler
 ******************************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ******************************************
 * Start Server
 ******************************************/
const PORT = process.env.PORT || 5500;
const isDev = process.env.NODE_ENV === "development";
const HOST = isDev ? "localhost" : "0.0.0.0"; // 🔹 localhost en dev, 0.0.0.0 en prod

app.listen(PORT, HOST, () => {
  console.log(`✅ App listening on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
});
