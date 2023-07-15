const bcrypt = require("bcryptjs");
const db = require("../models");
const transporter = require("../helper/nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const hbs = require("handlebars");
const path = require("path");
const dayjs = require("dayjs");

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
      staff.access_token = "";
      await staff.save();
      res.status(200).send({ message: "Successfully set up account" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },

  async clockIn(req, res) {
    try {
      const user = await db.Attendance.findOne({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });

      if (user) {
        return res.status(400).send({ message: "Staff already clocked in" });
      }

      await db.Attendance.create({
        user_id: req.user.id,
        clock_in: new Date(),
        date: new Date(),
        state: "halfday",
      });

      res.status(201).send({ message: "Clock in successful!" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },

  async clockOut(req, res) {
    try {
      const user = await db.Attendance.findOne({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });

      if (!user) {
        return res.status(400).send({ message: "Staff hasn't clock in" });
      } else if (user.clock_out) {
        return res.status(400).send({ message: "Staff already clock out" });
      }

      user.clock_out = new Date();
      user.state = "fullday";
      await user.save();
      res.status(201).send({ message: "Clock out successful!" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },

  async getAttendancePerDay(req, res) {
    try {
      const user = await db.Attendance.findOne({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });

      if (!user) {
        return res.status(204).send({ message: "Attendance not found" });
      }

      res
        .status(200)
        .send({ message: "Sucessfully retrieved data", data: user });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },
};
