const jwt = require("jsonwebtoken");

function newToken(user) {
  const payload = {
    id: user.id,
    name: user.nombre,
    email: user.email,
    id_role: user.id_rol,
  };

  const key = "secret";
  const options = {
    expiresIn: "24h",
  };

  const token = jwt.sign(payload, key, options);
  return token;
}

module.exports = newToken;
