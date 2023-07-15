const bcrypt = require("bcryptjs");
const db = require("../models");
const transporter = require("../helper/nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const hbs = require("handlebars");
const path = require("path");

module.exports = {
  async registerStaff(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const { email, full_name, birth_date, join_date, basic_salary } =
        req.body;

      const access_token = crypto.randomBytes(20).toString("hex");

      const existingStaff = await db.User.findOne({
        where: { email },
        transaction,
      });

      if (existingStaff) {
        await transaction.rollback();
        return res.status(400).send({
          message: "Credentials already registered",
        });
      }

      const newSalary = await db.Salary.create(
        { basic_salary },
        { transaction }
      );

      const newStaff = await db.User.create(
        {
          email,
          full_name,
          birth_date,
          join_date,
          access_token,
          role_id: 2,
          salary_id: newSalary.id,
        },
        { transaction }
      );

      await transaction.commit();

      const setUpLink = `${process.env.BASE_PATH_SETUP}${access_token}`;

      const templatePath = path.join(
        __dirname,
        "../helper/templateSetAccess.html"
      );
      const template = fs.readFileSync(templatePath, "utf-8");
      const templateCompile = hbs.compile(template);
      const htmlResult = templateCompile({ full_name, setUpLink });

      const nodemailerEmail = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "You've been registered. Please set up your account",
        html: htmlResult,
      };

      transporter.sendMail(nodemailerEmail, (error, info) => {
        if (error) {
          return res.status(500).json({ error: "Error sending email" });
        } else {
          res.status(201).send({
            message: "Staff registered successfully. Email has been sent",
            email: newStaff.email,
            full_name: newStaff.full_name,
            birth_date: newStaff.birth_date,
            join_date: newStaff.join_date,
          });
        }
      });
    } catch (error) {
      console.log(error.message);
      if (error.message === "Validation error") {
        const validationError = error.errors[0].message;
        return res.status(400).send({ message: validationError });
      }
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },
};
