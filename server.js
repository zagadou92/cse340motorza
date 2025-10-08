/*******************************************
 * Load Environment Variables First
 *******************************************/
require("dotenv").config();

/*******************************************
 * Required Modules
 *******************************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const pool = require("./database/");
const utilities = require("./utilities");
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const usersRoute = require("./routes/usersRoute");
const accountController = require("./controllers/accountController");

const app = express();

/*******************************************
 * View Engine & Layouts
 *******************************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/*******************************************
 * Core Middlewares
 *******************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*******************************************
 * Session Configuration (Must come before flash)
 *******************************************/
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      secure: process.env.NODE_ENV === "production", // true sur Render
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 heure
    },
  })
);

/*******************************************
 * Flash Messages (Must come right after session)
 *******************************************/
app.use(flash());

/*******************************************
 * Global Middleware - Accessible in all views
 *******************************************/
app.use((req, res, next) => {
  // Fonction messages() disponible dans EJS
  res.locals.messages = () => req.flash();

  // Messages séparés si tu veux aussi success / error directement
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  res.locals.errors = req.flash("errors");

  // Données utilisateur (si connecté)
  res.locals.accountData = res.locals.accountData || null;
  next();
});

/*******************************************
 * JWT Verification Middleware
 *******************************************/
app.use(utilities.checkJWTToken);

/*******************************************
 * Static Files (Public folder)
 *******************************************/
app.use(express.static(path.join(__dirname, "public")));

/*******************************************
 * Routes
 *******************************************/
app.use(staticRoutes);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/users", usersRoute);

// ✅ Logout route
app.post("/logout", utilities.handleErrors(accountController.logout));

/*******************************************
 * 404 Handler - Must be the Last Route
 *******************************************/
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page 🥹.",
  });
});

/*******************************************
 * Global Error Handler
 *******************************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    messages: () => req.flash(), // ✅ messages() accessible même en erreur
  });
});

/*******************************************
 * Start Server
 *******************************************/
const PORT = process.env.PORT || 5500;
const isDev = process.env.NODE_ENV === "development";
const HOST = isDev ? "localhost" : "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `✅ CSE Motors server running at http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`
  );
});
