const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const User = require("../models/user");

exports.user_GET = (req, res, next) => {
	console.log("hi");
	if (req.user) {
		res.json({ user: req.user, success: true });
	} else {
		res.json({ message: "Error", success: false });
	}
};
