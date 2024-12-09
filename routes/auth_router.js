const { Router } = require("express");
const authRouter = Router();

const { renderView } = require("../controllers/views");
const { login, logout } = require("../controllers/login");

authRouter.get("/login", renderView("login"));
authRouter.post("/login", login);
authRouter.get("/logout", logout);

module.exports = authRouter;
