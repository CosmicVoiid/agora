const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
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
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login/failed",
		session: false,
	}),
	(req, res, next) => {
		const googleUser = req.user;
		const token = jwt.sign(
			{ user: googleUser },
			process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
		);
		res
			.cookie("jwt", token, { httpOnly: true })
			.redirect(`${process.env.CLIENT_URL}/home`);
	}
);

router.get("/login/failed", (req, res) => {
	return res.status(401).json({ message: "failed", success: false });
});

//CRUD routes
router.get(
	"/user",
	passport.authenticate("jwt", { session: false }),
	userController.user_GET
);

module.exports = router;
