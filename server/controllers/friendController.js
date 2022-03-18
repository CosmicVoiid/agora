const Friend = require("../models/friend");
const User = require("../models/user");

exports.friend_POST = async (req, res) => {
	const { userA, userB } = req.body;
	let errors = false;

	const docA = await Friend.findOneAndUpdate(
		{ requester: userA, recipient: userB },
		{ $set: { status: "requested" } },
		{ upsert: true, new: true }
	);

	const docB = await Friend.findOneAndUpdate(
		{ recipient: userA, requester: userB },
		{ $set: { status: "pending" } },
		{ upsert: true, new: true }
	);

	const updateUserA = await User.findOneAndUpdate(
		{ _id: userA },
		{ $push: { friends: docA._id } }
	);

	const updateUserB = await User.findOneAndUpdate(
		{ _id: userB },
		{ $push: { friends: docB._id } }
	);

	updateUserA.save((err) => {
		if (err) {
			console.log(err);
			errors = true;
		}
	});
	updateUserB.save((err) => {
		if (err) {
			console.log(err);
			errors = true;
		}
	});

	if (!errors) {
		res.sendStatus(200);
	}
};
