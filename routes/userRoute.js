const express = require("express");

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validations/userValidationMiddleware");

const router = express.Router();

router.route("/signup").post(validatorMiddleware, authController.createUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboard);
router.route("/:id").delete(authController.deleteUser);
router.route("/update/:id").put(authController.updateUser);
module.exports = router;
