const {check, validationResult} = require("express-validator");
const User = require("../../models/User");

module.exports = [
	check("name").not().isEmpty().withMessage("Name can not be empty "),
	check("password").not().isEmpty().withMessage("Password can not be empty"),
	check("email").not().isEmpty().withMessage("Email can not be empty"),
	check("email")
		.isEmail()
		.withMessage("Please Enter Valid Email")
		.custom(userEmail => {
			return User.findOne({email: userEmail}).then(user => {
				if (user) {
					return Promise.reject("Email is already exists!");
				}
			});
		}),
];
