const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJWT;
const bcrypt = require("bcrpytjs");
const User = require("./models/user");

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ email: username }, (err, user) => {
			if (err) return done(err);
			if (!user) return done(null, false, { message: "Incorrect email" });
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, { message: "Incorrect password" });
				}
			});
		});
	})
);

passport.use(
	new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secret: process.env.JWT_SECRET_DEV,
	})
);

module.exports = passport;
