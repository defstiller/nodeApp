import {validationResult} from "express-validator";

function handleValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorsArray = errors.array();
		const errorToSend = errorsArray[0].msg;
		return res.status(422).json({ 
			message: errorToSend
		});
	}
	next();
}

export default handleValidationErrors;