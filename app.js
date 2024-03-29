const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const methodOverride = require("method-override");
const flash = require("connect-flash");

const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const port = process.env.PORT || 5000;
//Connect DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_CLIENT).then(() => {
	console.log("DB Connected Successfully");
});

///Template Engine

app.set("view engine", "ejs");

///Global Variables
global.userIN = null;
///Middleware
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: "process.env.MONGO_CLIENT",
		}),
	})
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.flashMessages = req.flash();

	next();
});
app.use(
	methodOverride("_method", {
		methods: ["POST", "GET"],
	})
);

///Routes
app.use("*", (req, res, next) => {
	userIN = req.session.userID;
	next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

app.listen(port, () => {
	console.log(`App started on ${port}`);
});
