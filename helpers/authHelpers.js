import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import {JWT_SECRET} from "../config.js";
import jwt from "jsonwebtoken";
async function loginHelper(req, res) {
	const user = await UserModel.findOne({ email: req.body.email });
	try{
		user
			? compareHashAndSignIn(req.body.password, user, res)
			: res.status(400).json({
				message: "Invalid email or password",
			});
	} catch (err) {
		res.status(500).json({
			message: "Error logging in user " + err.message,
		});
	}
}
async function compareHashAndSignIn(requestPassword, user, res) {
	const response = await bcrypt.compare(requestPassword, user.password);
	response
		? createToken(res, user, "User signed in successfully")
		: res.status(400).json({
			message: "Invalid email or password",
		});
}


async function signUpHelper(req, res) {
	try {
		UserModel.findOne({ email: req.body.email }, (err, user) => {
			err
				? res.status(500).json({
					message: "Error creating user " + err.message,
				})
				: hashAndCreateUser(user, res, req);
		});
	} catch (err) {
		res.status(500).json({
			message: "Error creating user " + err.message,
		});
	}
}
async function hashAndCreateUser(user, res, req) {
	const { email, password, name } = req.body;
	user
		? res.status(400).json({
			message: "Email already exists",
		})
		: bcrypt.hash(password, 10, function (error, hash) {
			const userInstance = new UserModel({
				name: name,
				email: email,
				password: hash,
			});

			error
				? res.status(500).json({
					message: "Error creating user " + error.message,
				})
				: userInstance.save((error, user) => {
					error
						? res.status(500).json({
							message: "Error registering user " + error.message,
						})
						: 
						createToken(res, user, "User registered successfully");
				});
		});
}
/**
 * This function creates a token and sends it to the client.
 * @param res - the response object
 * @param user - the user object that was returned from the database
 * @param message - The message to be sent to the user.
 */
async function createToken(res, user, message) {
	const expiresIn = 604800;
	const token = jwt.sign(
		{
			email: user.email,
		},
		JWT_SECRET,
		{ expiresIn },
	);
	res.status(200).json({		
		message,
		token,
	});
}
async function checkToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	token
		? jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) {
				res.status(401).json({
					message: "Invalid token",
				}); 
			} else {
				req.user = decoded;
				next();
			}
		})
		: res.status(401).json({
			message: "No token provided",
		});
}
			
export { loginHelper, signUpHelper, checkToken };
