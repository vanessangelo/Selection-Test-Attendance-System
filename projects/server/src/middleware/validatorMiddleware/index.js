const { body, validationResult } = require("express-validator");
const db = require("../../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkEmailUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { email: value } });
    if (user) {
      throw new Error("Email already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateLogin: validate([
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email formart is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),

  validateRegisterStaff: validate([
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email format is required"),
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("birth_date")
      .notEmpty()
      .withMessage("Birth date is required")
      .isDate()
      .withMessage("Invalid date format")
      .custom((value, { req }) => {
        const currentDate = new Date();
        const selectedDate = new Date(value);
        if (selectedDate > currentDate) {
          throw new Error("Birth date cannot be in the future");
        }
        return true;
      }),
    body("join_date")
      .notEmpty()
      .withMessage("Join date is required")
      .isDate()
      .withMessage("Invalid date format")
      .custom((value, { req }) => {
        const currentDate = new Date();
        const selectedDate = new Date(value);
        if (selectedDate > currentDate) {
          throw new Error("Join date cannot be in the future");
        }
        return true;
      }),
    body("basic_salary")
      .notEmpty()
      .withMessage("Salary is required")
      .isNumeric()
      .withMessage("Salary must be a numeric value"),
  ]),
};
