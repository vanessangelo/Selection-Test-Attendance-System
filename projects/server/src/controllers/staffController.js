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
      const today = dayjs();
      const isWeekday = today.day() > 0 && today.day() < 6;

      if (!isWeekday) {
        return res
          .status(400)
          .send({ message: "Staff can only clock in on weekdays" });
      }

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
      const today = dayjs();
      const isWeekday = today.day() > 0 && today.day() < 6;

      if (!isWeekday) {
        return res
          .status(400)
          .send({ message: "Staff can only clock in on weekdays" });
      }

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

  async getAttendanceLog(req, res) {
    const year = dayjs().year();
    const month = dayjs().month() + 1;
    const filters = {
      year: Number(req.query.year) || year,
      month: Number(req.query.month) || month,
      state: req.query.state
        ? req.query.state.split(",")
        : ["absence", "halfday", "fullday"],
      sort: req.query.sort || "DESC",
    };
    try {
      const start = dayjs(`${filters.year}-${filters.month}-01`);
      const end = start.endOf("month");

      const attendanceLogs = await db.Attendance.findAndCountAll({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [start.toDate(), end.toDate()],
          },
          state: {
            [db.Sequelize.Op.in]: filters.state,
          },
        },
        order: [["date", filters.sort]],
      });

      res.status(200).send({
        message: "Successfully retrieved attendance history",
        filters,
        data: attendanceLogs.rows.map((log) => ({
          date: log.date,
          clock_in: log.clock_in,
          clock_out: log.clock_out,
          state: log.state,
        })),
      });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },

  async getStaffPayroll(req, res) {
    const { year, month, sort } = req.query;

    let where = {
      user_id: req.user.id,
      year: year || "",
      month: month || "",
    };

    try {
      const payrollHistory = await db.Payroll.findOne({
        where,
        include: [
          {
            model: db.User,
            include: [
              {
                model: db.Salary,
                attributes: ["basic_salary"],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ["year", "month", "total_amount", "deduction"],
        raw: true,
      });

      return res
        .status(200)
        .send({ message: "Successfully retrieved data", data: payrollHistory });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },
};
