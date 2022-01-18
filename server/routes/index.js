const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.get("/", (res, req) => {
	res.json({ message: "Welcome to the API" });
});

router.get("/api/login", (req, res) => {
	res.json({ message: "Send username and password to login" });
});

router.post("/api/login", (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err || !user)
			return res.status(400).json({ message: "Error authenticating", user });

		req.login(user, { session: false }, (err) => {
			if (err) res.send(err);
		});

		const token = jwt.sign(user, process.env.JWT_SECRET_DEV);
		return res.json({ user, token });
	})(req, res);
});
