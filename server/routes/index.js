const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/", (req, res) => {
	res.json({ message: "Welcome to the API" });
});

router.get("/api/login", authController.login_GET);
router.post("/api/login", authController.login_POST);

router.get("/api/signup", authController.signup_GET);
router.post("/api/signup", authController.signup_POST);

module.exports = router;
