require("dotenv").config(); // Charger les variables d'environnement

/* ******************************************
 * Require Statements
 ******************************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const pool = require("./database");
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
app.set("views", path.join(__dirname, "views")); // chemin absolu
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ******************************************
 * Middleware
 ******************************************/
// Body parser moderne
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session middleware
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,             // éviter des réécritures inutiles
    saveUninitialized: false,  // sécurité
    name: "sessionId",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS en prod
      maxAge: 1000 * 60 * 60, // 1 heure
      sameSite: "lax",
    },
  })
);

// JWT check middleware
app.use(utilities.checkJWTToken);

// Expose cookies & login info to views
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  res.locals.loggedin = res.locals.loggedin || 0;
  res.locals.accountData = res.locals.accountData || null;
  next();
});

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

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
  try {
    const nav = await utilities.getNav();
    console.error(`Error at "${req.originalUrl}":`, err);

    const message =
      err.status === 404
        ? err.message
        : "Oh no! There was a crash. Maybe try a different route?";

    res.status(err.status || 500).render("errors/error", {
      title: err.status || "Server Error",
      message,
      nav,
    });
  } catch (error) {
    console.error("Error rendering error page:", error);
    res.status(500).send("Critical server error.");
  }
});

/* ******************************************
 * Start Server
 ******************************************/
const PORT = process.env.PORT || 5500;
const HOST = "0.0.0.0"; // toujours 0.0.0.0 pour Render

app.listen(PORT, HOST, () => {
  console.log(`✅ App listening on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});
