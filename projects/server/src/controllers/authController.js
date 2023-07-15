const bcrypt = require("bcryptjs");
const db = require("../models");
const { generateJWTToken } = require("../helper/generateJWTToken");

module.exports = {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: { email, access_token: "" },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const isPassMatch = await bcrypt.compare(password, user.password);

      if (isPassMatch) {
        const token = generateJWTToken(user);
        return res.status(200).send({ message: "Successful login", token });
      } else {
        return res.status(401).send({ message: "Invalid credential" });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const userProfile = await db.User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.Role,
          },
          {
            model: db.Salary,
          },
        ],
      });

      if (!userProfile) {
        return res.status(400).send({
          message: "User profile not found",
        });
      }

      return res.status(200).send({
        message: "Successfully retrieved user profile",
        data: userProfile,
      });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.message });
    }
  },
  async getStaffByAcessToken(req, res) {
    try {
      const userProfile = await db.User.findOne({
        where: {
          access_token: req.query.token,
        },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.Role,
          },
          {
            model: db.Salary,
          },
        ],
      });

      if (!userProfile) {
        return res.status(400).send({
          message: "User profile not found",
        });
      }

      return res.status(200).send({
        message: "Successfully retrieved user profile",
        data: userProfile,
      });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.message });
    }
  },
};
