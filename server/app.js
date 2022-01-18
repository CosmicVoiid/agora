if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
require("passport-config");

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

app.use("/", indexRouter);
