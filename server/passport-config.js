const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");
const User = require("./models/user");

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		function verify(email, password, done) {
			console.log("used");
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

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || process.env.JWT_SECRET_DEV,
		},
		function (jwtPayload, done) {
			User.findOne({ id: jwtPayload.sub }, function (err, user) {
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

module.exports = passport;
