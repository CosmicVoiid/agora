const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const friendController = require("../controllers/friendController");
const passport = require("../passport-config");

// Authentication routes
router.get("/api/login", authController.login_GET);
router.post("/api/login", authController.login_POST);

router.get("/api/signup", authController.signup_GET);
router.post("/api/signup", authController.signup_POST);

router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login/failed",
		session: false,
	}),
	(req, res, next) => {
		const googleUser = req.user;
		const token = jwt.sign(
			{ user: googleUser },
			process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
		);
		res
			.cookie("jwt", token, { httpOnly: true })
			.redirect("https://agora-atlas.herokuapp.com/home");
	}
);

router.get("/api/login/failed", (req, res) => {
	return res.status(401).json({ message: "failed", success: false });
});

//logout
router.get("/api/logout", (req, res) => {
	res.clearCookie("jwt").end();
});

//user routes
router.put(
	"/api/user/picture/:id",
	passport.authenticate("jwt", { session: false }),
	userController.user_picture_update_PUT
);

router.get(
	"/api/user",
	passport.authenticate("jwt", { session: false }),
	userController.user_GET
);

router.get(
	"/api/user/:id",
	passport.authenticate("jwt", { session: false }),
	userController.user_detail_GET
);

router.get(
	"/api/users",
	passport.authenticate("jwt", { session: false }),
	userController.users_GET
);

//post routes

router.get(
	"/api/post",
	passport.authenticate("jwt", { session: false }),
	postController.post_GET
);

router.get(
	"/api/post/:userId",
	passport.authenticate("jwt", { session: false }),
	postController.post_selection_GET
);

router.get(
	"/api/post/user/:id",
	passport.authenticate("jwt", { session: false }),
	postController.post_singleUser_GET
);

router.post(
	"/api/post",
	passport.authenticate("jwt", { session: false }),
	postController.post_POST
);

router.put(
	"/api/post/:id",
	passport.authenticate("jwt", { session: false }),
	postController.post_PUT
);

router.delete(
	"/api/post/:id",
	passport.authenticate("jwt", { session: false }),
	postController.post_DELETE
);

//likes routes

router.get(
	"/api/post/:id/rating",
	passport.authenticate("jwt", { session: false }),
	postController.post_rating_GET
);

router.post(
	"/api/post/:id/rating",
	passport.authenticate("jwt", { session: false }),
	postController.post_rating_POST
);

//comment routes

router.get(
	"/api/post/:id/comments",
	passport.authenticate("jwt", { session: false }),
	postController.post_comment_GET
);

router.post(
	"/api/post/:id/comments",
	passport.authenticate("jwt", { session: false }),
	postController.post_comment_POST
);

router.put(
	"/api/post/:id/comments/:commentId",
	passport.authenticate("jwt", { session: false }),
	postController.post_comment_PUT
);

router.delete(
	"/api/post/:id/comments/:commentId",
	passport.authenticate("jwt", { session: false }),
	postController.post_comment_DELETE
);

//friend routes

router.get(
	"/api/user/:id/friends",
	passport.authenticate("jwt", { session: false }),
	friendController.friend_GET
);

router.post(
	"/api/user/:id/friend",
	passport.authenticate("jwt", { session: false }),
	friendController.friend_POST
);

router.put(
	"/api/user/:id/friend",
	passport.authenticate("jwt", { session: false }),
	friendController.friend_PUT
);

router.delete(
	"/api/user/:id/friend",
	passport.authenticate("jwt", { session: false }),
	friendController.friend_DELETE
);

module.exports = router;
