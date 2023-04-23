const express = require("express");

const { validateBody, ctrlWrapper } = require("../../utils");

const {authenticate, upload} = require("../../middlewares/")

const {schemas} = require("../../models/user");

const ctrl = require("../../controllers/auth");

const router = express.Router();

// sing up/ register
router.post("/register", validateBody(schemas.registerSchema), ctrl.register)

router.get("/verify/:verificationCode", ctrl.verifyEmail);

router.post("/verify", validateBody(schemas.verifySchema), ctrl.resendEmail)

// sing in/ login
router.post("/login", validateBody(schemas.loginSchema), ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars", authenticate, upload.single("avatar", ctrl.updateAvatar))

module.exports = router;