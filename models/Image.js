import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
	postedBy: String,
	name: String,
	description: String,
	location: String,
	datePosted: String,
});


const ImageModel = mongoose.model("images", imageSchema);
export default ImageModel;