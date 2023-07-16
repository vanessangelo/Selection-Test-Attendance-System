"use strict";
const dayjs = require("dayjs");
const Chance = require("chance");
const chance = new Chance();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let dummy = [];
    let currentDate = dayjs().subtract(1, "month").startOf("month");
    let monthsToGenerate = 3;

    for (let i = 0; i < monthsToGenerate; i++) {
      let payrollMonth = currentDate.subtract(i, "month");
      let month = payrollMonth.month() + 1;
      let year = payrollMonth.year();

      dummy.push({
        user_id: 2,
        month: month.toString(),
        year: year.toString(),
        total_amount: chance.integer({ min: 2000, max: 3000 }),
        deduction: chance.integer({ min: 0, max: 500 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert("Payrolls", dummy, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Payrolls", null, {});
  },
};
