const bcrypt = require("bcryptjs");
const db = require("../models");
const transporter = require("../helper/nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const hbs = require("handlebars");
const path = require("path");

module.exports = {
  async setStaffAccount(req, res) {
    const { token } = req.query;
    const { full_name, birth_date, password } = req.body;

    try {
      const staff = await db.User.findOne({
        where: {
          access_token: token,
        },
      });
      if (!staff) {
        return res.status(404).send({ message: "Invalid token" });
      }
      if (full_name) {
        staff.full_name = full_name;
      }
      if (birth_date) {
        staff.birth_date = birth_date;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      staff.password = hashedPassword;
      staff.access_token = null;
      await staff.save();
      res.status(200).send({ message: "Successfully set up account" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },
};
