import formidable from "formidable";
import fs from "fs";
import ImageModel from "../models/Image.js";

async function parseFormData(req, res, next) {
	const form = new formidable.IncomingForm();
	form.parse(req, async (err, fields, files) => {
		if (err) {
			res.status(500).send(err);
		}
		req.fields = fields;
		req.files = files;
		next();
	} );
	
}
async function upload(req, res, next)  {
	const {file} = req.files;
	const oldPath = file.filepath;
	let newPath = `uploads/${file.originalFilename}`;
	if(fs.existsSync(newPath)) { // check if file already exists, if it does add current date to file name
		const dateToString = Date.now().toString();
		newPath = `uploads/${dateToString}_${file.originalFilename}` ;
	}
	fs.rename(oldPath, newPath, (err) => {
		if (err) {
			res.status(500).send(err);
		}
	});
	req.newPath = newPath;
	next();

}
async function uploadDataToDb(req, res) {
	const {fields, newPath} = req;
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
			message: `Image uploaded successfully with id: ${image._id}`,
		});
	}
	catch (err) {
		removeDataFromDb(image._id);
		res.status(500).json({
			message: "Error uploading " + err.message, 
		});
	}
}
async function removeDataFromDb(id) {
	try {
		await ImageModel.findByIdAndDelete(id);
	}
	catch (err) {
		console.log(err);
	}
}

export {parseFormData, upload, uploadDataToDb};
 