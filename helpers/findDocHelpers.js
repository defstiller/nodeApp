import ImageModel from "../models/Image.js";
import path from "path";
import mongoose from "mongoose";
import mime from "mime";
import fs from "fs";
async function checkId (req, res, next) {
	const {filesecret} = req.headers;
	if(filesecret) {
		mongoose.Types.ObjectId.isValid(filesecret)
			? next()
			: res.status(400).json({
				message: "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
			});
	} else {
		res.status(400).json({
			message: "No file secret provided",
		});
	}
	

}
async function findFile (req, res, next) {
	const {filesecret} = req.headers;
	const file = await ImageModel.findById(filesecret);
	const extension = path.extname(file.location);
	if(file) {
		req.detectedFile = file;
		if(req.originalUrl === "/download") {
			next();
		}
		else {
			const {postedBy, name, description, datePosted} = file;
			res.status(200).json({
				message: "File found",
				extension,
				postedBy,
				name,
				description,
				datePosted,
			});
		}
	} else {
		res.status(500).json({
			message: "No file found"
		});
	}
}

async function sendFile (req, res) {
	const {detectedFile} = req;
	const __dirname = path.resolve();
	const filePath = path.join(__dirname, detectedFile.location);
	const fileName = path.basename(filePath);
	const mimeType = mime.getType(filePath);
	res.setHeader("Content-Type", mimeType);
	res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
	res.setHeader("Content-Length", fs.statSync(filePath).size);
	res.status(200).sendFile(filePath);
}

export { findFile, sendFile, checkId };