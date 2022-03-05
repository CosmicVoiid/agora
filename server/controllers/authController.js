const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.login_GET = (req, res) => {
	res.json({ message: "Send username and password to login" });
};

exports.login_POST = (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err || !user) {
			return res
				.status(400)
				.json({ message: "Error authenticating", user, info: info.message });
		}

		const token = jwt.sign(
			{ user },
			process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
		);

		return res.status(200).cookie("jwt", token, { httpOnly: true }).end();
	})(req, res, next);
};

exports.signup_GET = (req, res) => {
	res.json({
		message: "Send first_name, last_name, email, password to signup",
	});
};

exports.signup_POST = [
	body("first_name", "First name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("last_name", "Last name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
	body("email", "Must enter a valid email address").isEmail(),
	body("password", "Password must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("password_confirm", "Passwords must match")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	check("password_confirm", "Passwords must match").custom(
		(value, { req }) => value === req.body.password
	),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({
				message: "There are errors with your request",
				errors: errors.array(),
			});
		}

		User.findOne({ email: req.body.email }, (err, user) => {
			if (err) {
				return res.json({
					message: "There are errors with your request",
					errors: err,
				});
			}
			if (user) {
				return res.json({
					message: "This email address is already in use",
					errors: [
						{ msg: "This email address is already in use", param: "email" },
					],
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
					if (err) return res.sendStatus(400);

					const user = new User({
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						email: req.body.email,
						password: hashedPassword,
					});

					user.save((err, result) => {
						if (err) {
							res.json({
								message: "Errors with saving to database",
								errors: err,
							});
							return next(err);
						}

						res.json({
							message: "Successfully stored to database",
							result: user,
						});
					});
				});
			}
		});
	},
];
