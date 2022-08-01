import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		minlength: 6,
		required: [true, "Email is required"],
	},
	password: {
		type: String,
		minlength: 6,
		required: [true, "Password is required"]
	}
})
const user = mongoose.model("users", userSchema);
export default user; 