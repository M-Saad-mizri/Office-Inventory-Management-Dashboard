const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // To store sessions in MongoDB
const path = require("path");
const inventoryRoutes = require("./routes/inventory"); // Adjust the path if needed

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard"); // Import the dashboard routes
const isAuthenticated = require("./middleware/authMiddleware"); // Auth middleware for protected routes

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/inventory-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded bodies (from form submissions)
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: "secretkey", // Use a strong secret key for production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/inventory-management",
      collectionName: "sessions",
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // One day expiration (adjust as needed)
  })
);

// Redirect from root to login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Routes
app.use("/", authRoutes); // Authentication routes (signup, login, etc.)
app.use("/dashboard", dashboardRoutes); // Use the dashboard routes
app.use("/", inventoryRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
