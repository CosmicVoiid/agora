const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const passport = require("../passport-config");

router.get("/", (req, res) => {
	res.json({ message: "Welcome to the API" });
});

// Authentication routes
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
		res.redirect(`${process.env.CLIENT_URL}/home`);
	}
);

router.get("/login/failed", (req, res) => {
	return res.status(401).json({ message: "failed", success: false });
});

router.get("/login/success", (req, res) => {
	console.log(req.user);
	if (req.user) {
		const googleUser = req.user;
		const token = jwt.sign(
			{ user: googleUser },
			process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
		);
		console.log(token);
		return res
			.status(200)
			.json({ message: "successful", user: googleUser, token });
	} else {
		return res.status(401).json({ message: "failed" });
	}
});

//CRUD routes
router.get(
	"/user",
	passport.authenticate("jwt", { session: false }),
	userController.user_GET
);

module.exports = router;
