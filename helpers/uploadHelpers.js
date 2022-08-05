import formidable from "formidable";
import fs from "fs";
import ImageModel from "../models/Image.js";
async function upload(req, res, next)  {
	const form = new formidable.IncomingForm();
	form.parse(req, async (err, fields, files) => {
		if (err) {
			res.status(500).send(err);
		}
		const oldPath = files.files.filepath;
		let newPath = `uploads/${files.files.originalFilename}`;
		if(fs.existsSync(newPath)) { // check if file already exists, if it does add current date to file name
			const dateToString = Date.now().toString()
			newPath = `uploads/${dateToString}_${files.files.originalFilename}` ;
		}
		fs.rename(oldPath, newPath, (err) => {
			if (err) {
				res.status(500).send(err);
			}
		});
		uploadFileToDb(fields, newPath, res, req);
	});

}
async function uploadFileToDb(fields, newPath, res, req) {
	const user = req.user.email;
	const date = new Date().toLocaleDateString();
	const image = new ImageModel({
		postedBy: user,
		name: fields.name,
		description: fields.description,
		location: newPath, 
		datePosted: date,
	});
	try {
		await image.save();
		res.status(200).json({
			message: "Uploaded successfully",
		});
	}
	catch (err) {
		removeFileFromDb(image._id);
		res.status(500).json({
			message: "Error uploading " + err.message, 
		});
	}
}
async function removeFileFromDb(id) {
	try {
		await ImageModel.findByIdAndDelete(id);
	}
	catch (err) {
		console.log(err);
	}
}

export default upload;
 