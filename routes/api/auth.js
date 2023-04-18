const express = require("express");

const { validateBody } = require("../../utils");

const {authenticate} = require("../../middlewares/")

const {schemas} = require("../../models/user");

const ctrl = require("../../controllers/auth");

const router = express.Router();

// sing up/ register
router.post("/register", validateBody(schemas.registerSchema), ctrl.register)

// sing in/ login
router.post("/login", validateBody(schemas.loginSchema), ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout)

module.exports = router;