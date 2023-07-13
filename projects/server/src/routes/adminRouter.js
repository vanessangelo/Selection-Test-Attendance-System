const router = require("express").Router();
const adminController = require("../controllers/adminController");
const validationMiddleware = require("../middleware/validatorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
router.post(
  "/register-staff",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  validationMiddleware.validateRegisterStaff,
  adminController.registerStaff
);

module.exports = router;
