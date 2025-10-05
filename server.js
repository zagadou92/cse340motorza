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
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

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
 * Security Middlewares
 ******************************************/

// 1️⃣ Helmet - protège contre XSS, sniffing, etc.
app.use(helmet());

// 2️⃣ Forcer HTTPS en production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// 3️⃣ Rate limiting - limite les requêtes (anti-brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max/IP
  message: "Trop de requêtes, réessayez plus tard.",
});
app.use(limiter);

/* ******************************************
 * Middleware standard
 ******************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware sécurisé
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
      secure: process.env.NODE_ENV === "production", // HTTPS obligatoire en prod
      httpOnly: true, // empêche l'accès JS
      sameSite: "strict", // empêche le vol de session
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

// Vérification du token JWT (si utilisé)
app.use(utilities.checkJWTToken);

// Expose cookies à EJS
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
 * Middleware de protection d’accès
 ******************************************/
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    req.flash("error", "Vous devez être connecté pour accéder à cette page.");
    return res.redirect("/account/login");
  }
  next();
}

/* ******************************************
 * Routes
 ******************************************/
app.use(staticRoutes);

// Page d’accueil
app.get("/", utilities.handleErrors(baseController.buildHome));

// Route protégée /inv (inventaire)
app.use("/inv", requireLogin, inventoryRoute);

// Comptes / utilisateurs
app.use("/account", accountRoute);
app.use("/users", usersRoute);

// Déconnexion
app.post("/logout", utilities.handleErrors(accountController.logout));

/* ******************************************
 * 404 Handler
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
const HOST = isDev ? "localhost" : "0.0.0.0"; // localhost en dev, 0.0.0.0 en prod

app.listen(PORT, HOST, () => {
  console.log(
    `✅ App listening on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`
  );
});
