const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RatingSchema = require("./rating");
const CommentSchema = require("./comment");

const PostSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	body: { type: String, required: true },
	ratings: [RatingSchema],
	comments: [CommentSchema],
	time: { type: Date, default: Date.now, required: true },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
