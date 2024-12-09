const { Router } = require("express");
const usersControllers = require("../controllers/user_controllers.js");
const turtlesControllers = require("../controllers/turtle_controllers.js");
const medicalReportControllers = require("../controllers/medical_record_controllers.js");
const apiRouter = Router();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");


apiRouter.use(isAuthenticated);

apiRouter.get("/turtles", turtlesControllers.getTurtles);
apiRouter.post("/turtles", turtlesControllers.createTurtle);
apiRouter.delete("/turtles/:id", turtlesControllers.deleteTurtle);
apiRouter.put("/turtles/:id", turtlesControllers.updateTurtle);
apiRouter.get("/turtles/species", turtlesControllers.getSpecies);

apiRouter.get("/medical_records", medicalReportControllers.getMedicalRecords);
apiRouter.post("/medical_records", medicalReportControllers.createMedicalRecord);
apiRouter.delete("/medical_records/:id", medicalReportControllers.deleteMedicalRecord);
apiRouter.put("/medical_records/:id", medicalReportControllers.updateMedicalRecord);

apiRouter.use(isAdmin);
apiRouter.get("/users", usersControllers.getUsers);
apiRouter.post("/users", usersControllers.createUser);
apiRouter.delete("/users/:id", usersControllers.deleteUser);
apiRouter.put("/users/:id", usersControllers.updateUser);
apiRouter.get("/users/roles", usersControllers.getRoles);

module.exports = apiRouter;
