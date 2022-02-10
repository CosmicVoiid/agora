const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth");
const passport = require("../passport-config");

router.get("/", (req, res) => {
	res.json({ message: "Welcome to the API" });
});

router.get("/api/login", authController.login_GET);
router.post("/api/login", authController.login_POST);

router.get("/api/signup", authController.signup_GET);
router.post("/api/signup", authController.signup_POST);

router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login/failed",
	}),
	(req, res, next) => {
		res.redirect(`${process.env.CLIENT_URL}/login`);
	}
);

router.get("/login/failed", (req, res) => {
	return res.status(401).json({ message: "failed", success: false });
});

router.get("/login/success", (req, res) => {
	if (req.user) {
		const googleUser = req.user;
		const token = jwt.sign(
			{ googleUser },
			process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
		);
		return res
			.status(200)
			.json({ message: "successful", user: googleUser, token });
	} else {
		return res.status(401).json({ message: "failed" });
	}
});

module.exports = router;
