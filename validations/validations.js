import { body } from "express-validator";

const loginValidation = [
	body("email")
		.isEmail()
		.withMessage("Email must be valid"),
	body("password")
		.isString()
		.withMessage("Password must be a string"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters"),
];
const signUpValidation = [
	body("email")
		.isEmail()
		.withMessage("Email must be valid"),
	body("password")
		.isString()
		.withMessage("Password must be a string"),
	body("password")
		.isStrongPassword()
		.withMessage("Enter strong password"),
];

export { loginValidation, signUpValidation };
