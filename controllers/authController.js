const User = require("../models/User");
const bcrypt = require("bcrypt");
const Category = require("../models/Category");
const Course = require("../models/Course");
const {validationResult} = require("express-validator");
const {find, findOne} = require("../models/User");

exports.createUser = async (req, res) => {
	try {
		const user = await User.create(req.body);
		req.flash("success", "User created, Log in!.");
		res.status(201).redirect("/login");
	} catch (error) {
		const errors = validationResult(req);
		for (let i = 0; i < errors.array().length; i++) {
			req.flash("error", `${errors.array()[i].msg}`);
		}
		res.status(400).redirect("/register");
	}
};

exports.loginUser = async (req, res) => {
	try {
		const {email, password} = req.body;
		const user = await User.findOne({email});

		if (user) {
			bcrypt.compare(password, user.password, (err, same) => {
				if (same) {
					//USER SESSION
					req.session.userID = user._id;

					res.status(200).redirect("/users/dashboard");
				} else {
					req.flash("error", "Your password is not correct!");
					res.status(400).redirect("/login");
				}
			});
		} else {
			req.flash("error", "User does not exists!");
			res.status(400).redirect("/login");
		}
	} catch (error) {
		res.status(201).json({
			status: "fail",
			error,
		});
	}
};

exports.logoutUser = async (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
};

exports.getDashboard = async (req, res) => {
	const user = await User.findOne({_id: req.session.userID}).populate(
		"courses"
	);
	const categories = await Category.find();
	const courses = await Course.find({user: req.session.userID});
	const users = await User.find();
	const roleList = ["admin", "student", "teacher"];
	if (user) {
		const userdetails = [user.name, user.email, user.role];
		console.log("Logged session ID =", req.session.userID, userdetails);
	}

	res.status(200).render("dashboard.ejs", {
		page_name: "dashboard",
		user,
		categories,
		courses,
		users,
		roleList,
	});
};

exports.deleteUser = async (req, res) => {
	try {
		await User.findOneAndRemove(req.params.id);
		await Course.deleteMany({user: req.params.id});
		req.flash("error", "User deleted!");
		console.log(req.body, req.params.id);
		res.status(200).redirect("/users/dashboard");
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};

exports.updateUser = async (req, res) => {
	try {
		const user = await User.findOne({_id: req.params.id});
		let newUserDetails = req.body;
		console.log(user);
		if (newUserDetails !== user) {
			if (newUserDetails.email === user.email) {
				delete newUserDetails.email;
			}
			await User.findOneAndUpdate({_id: req.params.id}, newUserDetails);
		} else {
			res.redirect("/users/dashboard/");
		}
		req.flash("success", "User updated!");
		console.log(newUserDetails);

		res.status(200).redirect("/users/dashboard");
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};
