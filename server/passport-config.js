const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/user");

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		function verify(email, password, done) {
			User.findOne({ email: email }, (err, user) => {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: "Incorrect email or password" });
				}
				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: "Incorrect email or password",
						});
					}
				});
			});
		}
	)
);

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["jwt"];
	}
	return token;
};

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_SECRET || process.env.JWT_SECRET_DEV,
		},
		function (jwtPayload, done) {
			User.findById(jwtPayload.user._id, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:5000/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOne({ email: profile._json.email }, (err, user) => {
				if (err) {
					return cb(err, false);
				}
				if (user) {
					return cb(null, user);
				} else {
					const newUser = new User({
						first_name: profile._json.given_name,
						last_name: profile._json.family_name,
						email: profile._json.email,
						profile_picture_url: profile._json.picture,
					}).save((error, result) => {
						if (error) {
							return cb(error, false);
						} else {
							return cb(null, result);
						}
					});
				}
			});
		}
	)
);

module.exports = passport;
