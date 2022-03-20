const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

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

exports.post_selection_GET = async (req, res, next) => {
	const { userId } = req.params;

	let friendArray = [];
	let idArray = await User.findById(userId).populate({
		path: "friends",
		populate: { path: "recipient" },
	});

	for (let i in idArray.friends) {
		if (idArray.friends[i].status === "friend") {
			console.log("worked");
			friendArray.push(idArray.friends[i].recipient._id);
		}
	}

	friendArray.push(userId);

	// res.json({ array: friendArray, success: true });

	// friendArray.push(userId);
	// console.log(friendArray);
	// res.json({ array: friendArray, success: true });

	Post.find({ user: { $in: friendArray } })
		.populate("user")
		.sort({ time: -1 })
		.exec((err, results) => {
			console.log(results);
			res.json({ results, success: true });
		});
};

exports.post_singleUser_GET = (req, res, next) => {
	const { id } = req.params;

	Post.find({ user: id })
		.populate("user")
		.sort({ time: -1 })
		.exec((err, results) => {
			if (err) console.log(err);
			else {
				console.log(results);
				res.json({ results, success: true });
			}
		});
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
	Post.findByIdAndDelete(id, {}, (err) => {
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

//Ratings controllers

exports.post_rating_GET = (req, res) => {
	const { id } = req.params;

	Post.findById(id)
		.select("ratings")
		.exec((err, data) => {
			if (err) console.log(err);
			else {
				let likes = 0;
				let dislikes = 0;
				let userRating = "";
				for (i in data.ratings) {
					if (
						JSON.stringify(req.user._id) ===
						JSON.stringify(data.ratings[i].user)
					) {
						userRating = data.ratings[i].rating;
					}

					if (data.ratings[i].rating === "Liked") {
						likes++;
					} else if (data.ratings[i].rating === "Disliked") {
						dislikes++;
					}
				}

				res.json({ likes, dislikes, userRating, success: true });
			}
		});
};

exports.post_rating_POST = async (req, res) => {
	const { id } = req.params;

	const rate = {
		post: id,
		user: req.user._id,
		rating: req.body.rating,
	};

	const post = await Post.findById(id);
	let found = false;

	if (post.ratings.length > 0) {
		for (i in post.ratings) {
			if (
				JSON.stringify(req.user._id) ===
				JSON.stringify(post.ratings[i].user._id)
			) {
				found = true;
				post.ratings[i] = rate;
			}
		}
	}

	if (!found) {
		post.ratings.push(rate);
	}

	post.save((err, data) => {
		if (err) console.log(err);
		else {
			res.json({ success: true });
		}
	});
};

// Comments controllers

exports.post_comment_GET = (req, res) => {
	const { id } = req.params;

	Post.findById(id)
		.populate("comments.user")
		.sort({ time: -1 })
		.exec((err, data) => {
			if (err) console.log(err);
			// console.log({ user: data.user, comments: data.comments, success: true });

			res.json({ user: data.user, comments: data.comments, success: true });
		});
};

exports.post_comment_POST = async (req, res) => {
	const { id } = req.params;

	const comment = {
		post: id,
		user: req.user._id,
		body: req.body.body,
	};

	const post = await Post.findById(id);
	post.comments.push(comment);

	post.save((err, data) => {
		if (err) console.log(err);
		else {
			console.log(data);
			res.json({ success: true });
		}
	});
};

exports.post_comment_PUT = async (req, res) => {
	const { commentId, id } = req.params;

	const post = await Post.findById(id);

	for (i in post.comments) {
		if (JSON.stringify(post.comments[i]._id) === JSON.stringify(commentId)) {
			post.comments[i].body = req.body.body;
			break;
		}
	}

	post.save((err, data) => {
		if (err) console.log(err);
		else {
			console.log("worked");
			console.log(data);
			res.json({ success: true });
		}
	});

	// post.findByIdAndUpdate(
	// 	id,
	// 	{ $pull: { comments: { _id: commentId } } },
	// 	{ safe: true },
	// 	(err) => {
	// 		if (err) console.log(err);
	// 		else {
	// 			res.status(200).json({ success: true });
	// 		}
	// 	}
	// );
};

exports.post_comment_DELETE = async (req, res) => {
	const { commentId, id } = req.params;

	Post.findByIdAndUpdate(
		id,
		{ $pull: { comments: { _id: commentId } } },
		{ safe: true },
		(err) => {
			if (err) console.log(err);
			else {
				res.status(200).json({ success: true });
			}
		}
	);
};
