const router = require("express").Router();
const validationMiddleware = require("../middleware/validatorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const staffController = require("../controllers/staffController");

router.patch(
  "/setup",
  validationMiddleware.validateSetAccount,
  staffController.setStaffAccount
);

router.post("/clock-in", authMiddleware.verifyToken, staffController.clockIn);

router.patch(
  "/clock-out",
  authMiddleware.verifyToken,
  staffController.clockOut
);

router.get(
  "/attendance",
  authMiddleware.verifyToken,
  staffController.getAttendancePerDay
);

module.exports = router;
