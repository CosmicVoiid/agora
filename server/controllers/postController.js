const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const Post = require("../models/post");
const { compareSync } = require("bcryptjs");

exports.post_GET = (req, res, next) => {
	if (req.user) {
		Post.find()
			.populate("user")
			.sort({ time: -1 })
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

exports.post_PUT = [
	body("body", "Body must not be empty").trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty() || !req.user) {
			return res.json({
				message: "There are errors with your request",
				errors: errors.array(),
				success: false,
			});
		}

		const { id } = req.params;

		const post = new Post({
			_id: id,
			user: req.user,
			body: req.body.body,
		});

		Post.findByIdAndUpdate(id, post, {}, (err) => {
			if (err)
				res.json({
					message: "Error deleting from database",
					success: false,
					err,
				});
			else
				res.json({
					message: "Successfully updated to database",
					success: true,
				});
		});
	},
];

exports.post_DELETE = (req, res) => {
	const { id } = req.params;
	Post.findByIdAndDelete(id, post, {}, (err) => {
		if (err)
			res.json({
				message: "Error deleted from database",
				success: false,
			});
		else
			res.json({
				message: "Successfully deleted from database",
				success: true,
			});
	});
};
