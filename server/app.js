if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
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

//middleware
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
	cors({
		origin: "https://agora-atlas.herokuapp.com",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", indexRouter);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "/client/build", "index.html"));
	});
}
