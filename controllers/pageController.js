const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getIndexPage = async (req, res) => {
	const courses = await Course.find().sort("-createdAt").limit(2);
	const totalCourses = await Course.find().countDocuments();
	const totalStudents = await User.countDocuments({role: "student"});
	const totalTeachers = await User.countDocuments({role: "teacher"});
	res.status(200).render("index", {
		page_name: "index",
		courses,
		totalCourses,
		totalStudents,
		totalTeachers,
	});
};

exports.getAboutPage = (req, res) => {
	res.status(200).render("about.ejs", {
		page_name: "about",
	});
};

exports.getCoursesPage = (req, res) => {
	res.status(200).render("courses.ejs", {
		page_name: "about",
	});
};

exports.getLoginPage = (req, res) => {
	res.status(200).render("login.ejs", {
		page_name: "login",
	});
};

exports.getRegisterPage = (req, res) => {
	res.status(200).render("register.ejs", {
		page_name: "register",
	});
};

exports.getContactPage = (req, res) => {
	res.status(200).render("contact.ejs", {
		page_name: "contact",
	});
};
exports.sendMail = async (req, res) => {
	const output = `  <h1>Mail Details </h1>
	<ul>
	  <li>Name: ${req.body.name}</li>
	  <li>Email: ${req.body.email}</li>
	</ul>
	<h1>Message</h1>
	<p>${req.body.message}</p>
	`;

	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			auth: {
				user: "keon.champlin61@ethereal.email",
				pass: "xwVCnqey2UMzcnEyyJ",
			},
		});
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"EDU SMART" <info@brtedu.com>', // sender address
			to: "keon.champlin61@ethereal.email", // list of receivers
			subject: "EDU NEW FORM", // Subject line
			html: output, // html body
		});

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		req.flash("success", "Mail sent succesfuly.");
		res.status(201).redirect("contact");
		console.log(res.locals.flashMessages);
	} catch (err) {
		req.flash("error", `Something happened! ${err}`);
		res.status(400).redirect("contact");
	}
};
