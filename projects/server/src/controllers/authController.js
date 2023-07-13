const bcrypt = require("bcryptjs");
const db = require("../models");
const { generateJWTToken } = require("../helper/generateJWTToken");

module.exports = {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: { email },
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
};
