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

//Likes and Dislike controllers

exports.post_rating_GET = async (req, res) => {
	const { id } = req.params;

	// try {
	// const likes = await Post.findById(id).populate({
	// 	path: "likes",
	// 	model: Like,
	// 	populate: { path: "user", select: "_id", model: User },
	// });
	// const usersLiked = await Post.findById(id).populate("likes.user");

	// Post.findById(id)
	// 	.populate({ path: "likes", model: Like })
	// 	.exec((err, results) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			console.log(results);
	// 		}
	// 	});

	// const userIncluded = false;
	// const populatedLikes = likes.populated("user");
	// console.log(populatedLikes);
	// const populatedUsers = usersLiked.populated("user");
	// console.log(populatedUsers);

	// console.log(likes.populatedLikes[1].user);

	// for (let l in populatedLikes) {
	// 	console.log(populatedLikes[l].user);
	// 	if (populatedLikes[l].user === req.user._id) {
	// 		userIncluded = true;
	// 	}
	// }
	// const info = {
	// 	length: likes.populated("likes").length,
	// 	userIncluded,
	// };

	// console.log(info);
	// } catch (err) {
	// 	console.log(err);
	// }

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
						console.log("worked");
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
	});
};
