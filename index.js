import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config.js";
import { loginValidation, signUpValidation } from "./validations/validations.js";
import { loginHelper, signUpHelper, checkToken } from "./helpers/authHelpers.js";
import handleValidationErrors from "./validations/handleValidationErrors.js";
import cors from "cors";
import runFileScan from "./helpers/runFileScan.js";
import bodyParser from "body-parser";
import {upload, parseFormData, uploadDataToDb} from "./helpers/uploadHelpers.js"; 
import {findFile, sendFile, checkId} from "./helpers/findDocHelpers.js";

mongoose
	.connect(MONGODB_URI, {useNewUrlParser: true})
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
	methods: ["GET","POST","DELETE","UPDATE","PUT","PATCH"]
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
	parseFormData,
	runFileScan,
	upload,
	uploadDataToDb
);
app.get("/upload/find",
	checkToken,
	checkId,
	findFile
);
app.get("/download",
	checkToken,
	checkId,
	findFile,
	sendFile
);
app.listen(PORT, (error) => {
	if (error) {
		console.log("Error: ", error);
	} else {
		console.log(`Server is listening on port ${PORT}`);
	}
});
 