const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	rating: {
		type: String,
		required: true,
		enum: ["Liked", "N/A", "Disliked"],
		default: "N/A",
	},
});

module.exports = RatingSchema;
