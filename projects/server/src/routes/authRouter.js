const router = require("express").Router();
const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validatorMiddleware");

router.post(
  "/login",
  validationMiddleware.validateLogin,
  authController.loginUser
);

module.exports = router;
