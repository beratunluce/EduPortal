const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
	name: {
		type: String,

		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["student", "admin", "teacher"],
		default: "student",
	},
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
});
UserSchema.pre("save", function (next) {
	if (!this.isModified("password")) return next();
	const user = this;
	bcrypt.hash(user.password, 10, function (err, hash) {
		user.password = hash;
		next();
	});
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
