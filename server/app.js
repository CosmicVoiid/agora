if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();

app.listen(process.env.PORT || process.env.PORT_DEV, () => {
	console.log(
		"App listening on port " + (process.env.PORT || process.env.PORT_DEV)
	);
});
