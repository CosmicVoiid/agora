const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	body: { type: String, required: true },
	time: { type: Date, default: Date.now, required: true },
});

module.exports = CommentSchema;
