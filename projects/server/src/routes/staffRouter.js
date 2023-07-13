const router = require("express").Router();
const validationMiddleware = require("../middleware/validatorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const staffController = require("../controllers/staffController");

router.patch(
  "/setup",
  validationMiddleware.validateSetAccount,
  staffController.setStaffAccount
);

module.exports = router;
