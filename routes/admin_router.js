const { Router } = require("express");
const adminRouter = Router();

const { renderView, renderViewAdmin } = require("../controllers/views");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { sendReport } = require("../controllers/reports");

adminRouter.use(isAuthenticated);
adminRouter.get("/", renderViewAdmin);
adminRouter.get("/turtles", renderView("turtles"));
adminRouter.get("/medical_records", renderView("medical_records"));

adminRouter.use(isAdmin);
adminRouter.get("/users", renderView("users"));
adminRouter.get("/report/:report", sendReport);

module.exports = adminRouter;
