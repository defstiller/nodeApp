import UserModel from "../models/User.js";
async function findUser(req, res, functionToRunIfFound) {
	let userData;
	try {
		UserModel.findOne({ email: req.user.email}, (err, user) => {
			err
				? res.status(500).json({
					message: "Error" + err.message,
				})
				: userData = user;
		});
	} catch (err) {
		res.status(500).json({
			message: "Error " + err.message,
		});
	}
	console.log(userData);
	return userData
}

export default findUser;