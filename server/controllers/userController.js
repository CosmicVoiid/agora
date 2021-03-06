const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const User = require("../models/user");

exports.user_GET = (req, res, next) => {
	// if (req.user) {
	// 	res.json({ user: req.user, success: true });
	// } else {
	// 	res.json({ message: "Error", success: false });
	// }

	User.findById(req.user._id)
		.populate("friends")
		.exec((err, data) => {
			if (err) {
				console.log(err);
				res.json({ message: "Error", success: false });
			} else {
				res.json({ user: data, success: true });
			}
		});
};

exports.users_GET = (req, res, next) => {
	User.find({}).exec((err, data) => {
		if (err) {
			console.log(err);
			res.json({ message: "err", success: false });
		} else {
			res.json({ users: data, success: true });
		}
	});
};

exports.user_detail_GET = (req, res) => {
	const { id } = req.params;
	User.findById(id)
		.populate("friends")
		.exec((err, data) => {
			if (err) {
				console.log(err);
				res.json({ message: "Error", success: "false" });
			} else {
				res.json({ user: data, success: true });
			}
		});
};

exports.user_picture_update_PUT = (req, res) => {
	const { id } = req.params;

	User.findByIdAndUpdate(id, {
		$set: { profile_picture_url: req.body.pic_url },
	}).exec((err, data) => {
		if (err) console.log(err);
		else res.json({ success: true });
	});
};
