import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		minlength: 6,
		required: true,
	},
	password: {
		type: String,
		minlength: 6,
		required: true,
	},
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
