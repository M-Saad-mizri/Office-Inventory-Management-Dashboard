// middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user; // Set req.user from session
    return next(); // Proceed if the user is authenticated
  }
  res.redirect("/login"); // Redirect to login if not authenticated
}

module.exports = isAuthenticated;
