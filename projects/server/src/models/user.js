"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasMany(models.Attendance, { foreignKey: "user_id" });
      User.belongsTo(models.Salary, { foreignKey: "salary_id" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      full_name: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      join_date: DataTypes.DATE,
      password: DataTypes.STRING,
      access_token: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      salary_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
