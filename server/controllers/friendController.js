const Friend = require("../models/friend");
const User = require("../models/user");

exports.friend_GET = async (req, res) => {
	const { id } = req.params;
	const friendArray = [];

	User.findById(id)
		.populate({ path: "friends", populate: { path: "recipient" } })
		.exec((err, data) => {
			for (let i in data.friends) {
				if (data.friends[i].status === "friend") {
					friendArray.push(data.friends[i]);
				}
			}

			if (err) console.log(err);
			else {
				console.log(friendArray);
				res.json({ friends: friendArray, success: true });
			}
		});
};

exports.friend_POST = async (req, res) => {
	const userA = req.params.id;
	const { userB } = req.body;
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
		res.status(200).json({ success: true });
	}
};

exports.friend_PUT = async (req, res) => {
	const userA = req.params.id;
	const { userB } = req.body;

	let errors = false;

	const updateUserA = await Friend.findOneAndUpdate(
		{ requester: userA, recipient: userB },
		{ $set: { status: "friend" } }
	);

	const updateUserB = await Friend.findOneAndUpdate(
		{ recipient: userA, requester: userB },
		{ $set: { status: "friend" } }
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
		res.status(200).json({ success: true });
	}
};

exports.friend_DELETE = async (req, res) => {
	const userA = req.params.id;
	const { userB } = req.body;
	let errors = false;

	const docA = await Friend.findOneAndRemove({
		requester: userA,
		recipient: userB,
	});
	const docB = await Friend.findOneAndRemove({
		recipient: userA,
		requester: userB,
	});
	const updateUserA = await User.findOneAndUpdate(
		{ _id: userA },
		{ $pull: { friends: docA._id } }
	);
	const updateUserB = await User.findOneAndUpdate(
		{ _id: userB },
		{ $pull: { friends: docB._id } }
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

	if (errors) {
		res.sendStatus(400);
	} else {
		res.status(200).json({ success: true });
	}
};
