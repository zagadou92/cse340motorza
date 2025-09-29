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

// -----------------------------
// Session middleware (sauvegarde en Postgres)
// -----------------------------
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false, // ✅ mieux que true pour éviter d’écraser la session à chaque req
    saveUninitialized: false, // ✅ n’enregistre pas une session vide
    name: "sessionId",
    cookie: {
      secure: process.env.NODE_ENV === "production", // true en prod (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

// Vérifie si un JWT est présent (utile si tu ajoutes une API)
app.use(utilities.checkJWTToken);

// Expose cookies et session aux vues
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  res.locals.session = req.session; // 🔹 permet d’utiliser session dans EJS
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

// Inventory routes (protégées avec safeCheckAccountType dans tes routes)
app.use("/inv", inventoryRoute);

// Account routes (login, register, etc.)
app.use("/account", accountRoute);

// Users routes
app.use("/users", usersRoute);

// Logout route (vide la session et redirige)
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur logout:", err);
      req.flash("notice", "Error logging out.");
      return res.redirect("/");
    }
    res.clearCookie("sessionId"); // supprime le cookie de session
    req.flash("notice", "You have been logged out successfully.");
    res.redirect("/account/login");
  });
});

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
  console.log(
    `✅ App listening on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`
  );
});
