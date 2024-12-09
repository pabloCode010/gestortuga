const { pool } = require("../database/pool");
const hashPassword = require("../utils/hash_password");

async function createUser({ name, last_name_pat, last_name_mat, email, username, password, id_role }) {
  password = hashPassword(password);
  const query = "INSERT INTO Usuarios (nombre, apellido_pat, apellido_mat, email, usuario, contraseña, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(
    query,
    [name, last_name_pat, last_name_mat, email, username, password, id_role]
  );

  return {
    id: result.insertId,
    name, last_name_pat, last_name_mat,
    email, username, password,
    id_role,
  };
}

async function getUsers({ id, name, email, username, id_role }) {
  const query = `
    SELECT id, nombre, apellido_pat, apellido_mat, email, usuario, contraseña, id_rol
    FROM Usuarios
    WHERE (? IS NULL OR ? = '' OR id = ?) AND
          (? IS NULL OR ? = '' OR nombre = ?) AND
          (? IS NULL OR ? = '' OR email = ?) AND
          (? IS NULL OR ? = '' OR usuario = ?) AND
          (? IS NULL OR ? = '' OR id_rol = ?)
  `;

  const [rows] = await pool.query(query, [
    id, id, id,
    name, name, name,
    email, email, email,
    username, username, username,
    id_role, id_role, id_role
  ]);

  return rows.map((user) => ({
    id: user.id,
    name: user.nombre,
    last_name_pat: user.apellido_pat,
    last_name_mat: user.apellido_mat,
    email: user.email,
    username: user.usuario,
    password: user.contraseña,
    id_role: user.id_rol,
  }));
}

async function deleteUserById(id) {
  const query = "DELETE FROM Usuarios WHERE id = ?";
  await pool.query(query, [id]);
}

async function updateUserById(id, { name, last_name_pat, last_name_mat, email, username, password, id_role }, newPassword) {
  const query = `
    UPDATE Usuarios
    SET nombre = ?, apellido_pat = ?, apellido_mat = ?, email = ?, usuario = ?, contraseña = ?, id_rol = ?
    WHERE id = ?
  `;
  
  if(newPassword === "true") {
    password = hashPassword(password);
  }

  await pool.query(query, [name, last_name_pat, last_name_mat, email, username, password, id_role, id]);
  return { id, name, last_name_pat, last_name_mat, email, username, password, id_role };
}

async function getRoles() {
  const query = "SELECT * FROM Roles";
  const [rows] = await pool.query(query);
  
  return rows.map((role) => ({
    id: role.id,
    name: role.nombre,
  }));
}

module.exports = {
  createUser,
  getUsers,
  deleteUserById,
  updateUserById,
  getRoles,
};
