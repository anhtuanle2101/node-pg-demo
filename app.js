const express = require("express");
const app = express();
const ExpressError = require("./expressError");

// parse request body into json
app.use(express.json());

// users Routes
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// 404 error handler
app.use((req, res, next)=>{
	const err = new ExpressError("Page not found", 404);

	return next(err);
})

// generic error handler
app.use((err, req, res, next)=>{
	const status = err.status || 500;
	const msg = err.msg || "This is an error";

	res.status(status).json({
		error:{
			status: status,
			msg: msg
		}
	})
})

module.exports = app;
