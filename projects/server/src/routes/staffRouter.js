const router = require("express").Router();
const validationMiddleware = require("../middleware/validatorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const staffController = require("../controllers/staffController");

router.patch(
  "/setup",
  validationMiddleware.validateSetAccount,
  staffController.setStaffAccount
);

router.post(
  "/clock-in",
  authMiddleware.verifyToken,
  authMiddleware.verifyStaff,
  staffController.clockIn
);

router.patch(
  "/clock-out",
  authMiddleware.verifyToken,
  authMiddleware.verifyStaff,
  staffController.clockOut
);

router.get(
  "/attendance",
  authMiddleware.verifyToken,
  authMiddleware.verifyStaff,
  staffController.getAttendancePerDay
);

router.get(
  "/my-attendances",
  authMiddleware.verifyToken,
  authMiddleware.verifyStaff,
  staffController.getAttendanceLog
);

router.get(
  "/my-payroll",
  authMiddleware.verifyToken,
  authMiddleware.verifyStaff,
  staffController.getStaffPayroll
);

module.exports = router;
