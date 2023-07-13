const jwt = require("jsonwebtoken");

module.exports = {
  generateJWTToken(user) {
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    return token;
  },
};
