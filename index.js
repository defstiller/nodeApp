import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config.js";
import UserModel from "./models/User.js";
import { loginValidation, signUpValidation } from "./validations/validations.js";
import bcrypt from "bcrypt";
import { loginHelper, signUpHelper, checkToken } from "./helpers/authHelpers.js";
import handleValidationErrors from "./validations/handleValidationErrors.js";
import cors from "cors";
import ImageModel from "./models/Image.js";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import upload from "./helpers/uploadHelpers.js"; 
import formidable from "formidable";
import multer from "multer";
mongoose
	.connect(MONGODB_URI, {useNewUrlParser: true})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log("Error connecting to MongoDB: ", err.message);
	});

const app = express();
const uploadMulter = multer({ dest: "uploads/" });
app.use(express.json());
app.use(cors({
	origin: [PORT, "http://localhost:3000"],
}));
app.use(bodyParser.urlencoded(
	{ extended:true }
));

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
app.post("/upload",
	checkToken,
	upload,
);
app.get("/upload",
	checkToken,
	
);
app.listen(PORT, (error) => {
	if (error) {
		console.log("Error: ", error);
	} else {
		console.log(`Server is listening on port ${PORT}`);
	}
});
