if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const passport = require("./passport-config");

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

app.use(morgan("dev"));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use("/", indexRouter);
