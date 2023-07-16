"use strict";
const bcrypt = require("bcryptjs");

const generatePassword = async (PW) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(PW, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const pw = await generatePassword("!Password1");
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "admin@gmail.com",
          full_name: "admin",
          birth_date: "1999-01-01",
          join_date: "2023-01-01",
          password: pw,
          access_token: "",
          role_id: 1,
          salary_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "mockstaff@gmail.com",
          full_name: "mockstaff",
          birth_date: "1999-01-01",
          join_date: "2023-01-01",
          password: pw,
          access_token: "",
          role_id: 2,
          salary_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
