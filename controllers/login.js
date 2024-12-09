const { pool } = require("../database/pool");
const newToken = require("../jwt/new_token");
const hashPassword = require("../utils/hash_password");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const [results] = await pool.query(
      "SELECT * FROM Usuarios WHERE usuario = ? AND contraseña = ?",
      [username, hashPassword(password)]
    );

    if (results.length === 0) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = newToken(results[0]);
    res.cookie("Authorization", token, { httpOnly: true, sameSite: true });
    res.json({ message: "Autenticación Exitosa", redirect: "/admin" });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.clearCookie("Authorization");
  res.redirect("/");
}

module.exports = {
  login,
  logout,
};
