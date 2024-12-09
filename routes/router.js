const { Router } = require("express");
const router = Router();

const adminRouter = require("./admin_router.js");
const authRouter = require("./auth_router.js");
const apiRouter = require("./api_router.js");
const { renderView } = require("../controllers/views");

router.get("/", renderView("index"));
router.use(authRouter)
router.use("/admin", adminRouter);
router.use("/api/v1", apiRouter)

module.exports = router;
