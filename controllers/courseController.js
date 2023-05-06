const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const session = require("express-session");
exports.courseCreate = async (req, res) => {
	try {
		const course = await Course.create({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			user: req.session.userID,
		});
		req.flash("success", "Course created.");
		res.status(201).redirect("/courses");
	} catch {
		req.flash("error", "Error Course couldn't created.");
		res.status(400).redirect("/courses");
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		const categorySlug = req.query.categories;
		const query = req.query.search;

		const category = await Category.findOne({slug: categorySlug});

		let filter = {};
		if (categorySlug) {
			filter = {category: category._id};
		}
		if (query) {
			filter = {name: query};
		}
		if (!query && !categorySlug) {
			(filter.name = ""), (filter.category = null);
		}
		const courses = await Course.find({
			$or: [
				{name: {$regex: ".*" + filter.name + ".*", $options: "i"}},
				{category: filter.category},
			],
		})
			.sort("-createdAt")
			.populate("user");

		const categories = await Category.find();

		res.status(200).render("courses.ejs", {
			courses,
			categories,
			page_name: "courses",
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};

exports.getCourse = async (req, res) => {
	try {
		const course = await Course.findOne({slug: req.params.slug}).populate(
			"user"
		);
		const user = await User.findById(req.session.userID);
		const categories = await Category.find();
		res.status(200).render("course.ejs", {
			course,
			user,
			page_name: "courses",
			categories,
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
		console.log(error);
	}
};

exports.enrollCourse = async (req, res) => {
	try {
		const user = await User.findById(req.session.userID);
		await user.courses.addToSet({_id: req.body.course_id});
		await user.save();
		console.log(user.courses);

		res.status(200).redirect("/users/dashboard");
	} catch (error) {
		console.log(error);
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};

exports.releaseCourse = async (req, res) => {
	try {
		const user = await User.findById(req.session.userID);
		await user.courses.pull({_id: req.body.course_id});
		await user.save();
		res.status(200).redirect("/users/dashboard");
		console.log(user.courses);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};

exports.deleteCourse = async (req, res) => {
	try {
		const course = await Course.findOneAndRemove({slug: req.params.slug});
		await User.deleteMany({courses: req.params.id});

		req.flash("error", `${course.name} has been removed successfully`);

		res.status(200).redirect("/users/dashboard");
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};

exports.updateCourse = async (req, res) => {
	try {
		await Course.findOneAndUpdate({slug: req.params.slug}, req.body);

		res.status(200).redirect("/users/dashboard");
	} catch (error) {
		res.status(400).json({
			status: "fail",
			error,
		});
	}
};
