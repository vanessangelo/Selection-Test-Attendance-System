const router = require("express").Router();
const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validatorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/login",
  validationMiddleware.validateLogin,
  authController.loginUser
);

router.get("/profile", authMiddleware.verifyToken, authController.getUserById);
router.get("/not-setup/profile", authController.getStaffByAcessToken);

module.exports = router;
