if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const indexRouter = require("./routes/index");
require("./passport-config");

//create server
const app = express();

//connect to MongoDB
const port = process.env.PORT || process.env.PORT_DEV;
const dbURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEV;

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(port, () => {
			console.log("App listening on port " + port);
		});
	})
	.catch((err) => {
		console.log(err);
	});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", indexRouter);
