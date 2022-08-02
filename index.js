import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config.js";
import UserModel from "./models/User.js";
import { loginValidation, signUpValidation } from "./validations/validations.js";
import bcrypt from "bcrypt";
import { loginHelper, signUpHelper } from "./helpers/authHelpers.js";
import handleValidationErrors from "./validations/handleValidationErrors.js";
import cors from "cors";
mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log("Error connecting to MongoDB: ", err.message);
	});

const app = express();
app.use(express.json());
app.use(cors({
	origin: [PORT, "http://localhost:3000"],
}));

app.get("/", (req, res) => {
	console.log(req.body.email);
	res.send("Hello there!");
});

app.post("/auth/register", 
	signUpValidation,  
	handleValidationErrors,
	signUpHelper,
);
app.post("/auth/login", 
	loginValidation,
	handleValidationErrors,
	loginHelper,
);
app.listen(PORT, (error) => {
	if (error) {
		console.log("Error: ", error);
	} else {
		console.log(`Server is listening on port ${PORT}`);
	}
});
