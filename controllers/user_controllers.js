const userServices = require("../services/user_services.js");

async function createUser(req, res, next) {
  try {
    const newUser = await userServices.createUser(req.body);
    res.json({
        message: "Usuario creado exitosamente",
        user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await userServices.getUsers(req.query);
    res.json({
        message: `Se encontraron ${users.length} usuarios`,
        users,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await userServices.deleteUserById(req.params.id);
    res.json({
        message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const updatedUser = await userServices.updateUserById(req.params.id, req.body, req.query.new_password);
    res.json({
        message: "Usuario actualizado exitosamente",
        user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

async function getRoles(req, res, next) {
  try {
    const roles = await userServices.getRoles();
    res.json({
        message: `Se encontraron ${roles.length} roles`,
        roles,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  getRoles,
};
