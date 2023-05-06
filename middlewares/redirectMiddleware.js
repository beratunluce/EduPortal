const User = require("../models/User");

module.exports = (req, res, next) => {
	req.session.userID ? res.redirect("/") : next();
};
