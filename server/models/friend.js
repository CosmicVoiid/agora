const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema(
	{
		requester: { type: Schema.Types.ObjectId, ref: "User" },
		recipient: { type: Schema.Types.ObjectId, ref: "User" },
		status: { type: String, enum: ["add", "requested", "pending", "friend"] },
	},
	{ timestamps: true }
);

const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;
