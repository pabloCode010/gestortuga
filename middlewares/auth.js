const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.Authorization;
    if (!token) {
      return res.redirect("/login");
    }
    const secretKey = "secret";
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect("/login");
  }
}

function isAdmin(req, res, next) {
  const user = req.user;
  if (user.id_role === 1) {
    return next();
  }
  res.redirect("/admin");
}

module.exports = {
  isAuthenticated,
  isAdmin,
};
