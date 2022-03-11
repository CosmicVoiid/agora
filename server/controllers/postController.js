const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.post_GET = (req, res, next) => {
	if (req.user) {
		Post.find()
			.populate("user")
			.exec((err, results) => {
				res.json({ results, success: true });
			});
	} else {
		res.json({ message: "Error", success: false });
	}
};

exports.post_POST = [
	body("body", "Body must not be empty").trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty() || !req.user) {
			return res.json({
				message: "There are errors with your request",
				errors: errors.array(),
			});
		}

		const post = new Post({
			user: req.user,
			body: req.body.body,
		}).save((err, result) => {
			if (err) {
				res.json({
					message: "Errors with saving to database",
					errors: err,
					success: false,
				});
				return next(err);
			}

			res.json({
				message: "Successfully stored to database",
				success: true,
			});
		});
	},
];
