"use strict";
const Chance = require("chance");
const dayjs = require("dayjs");

const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

function isBusinessDay(date) {
  const day = date.utc().day();
  return day !== 0 && day !== 6;
}

const chance = new Chance();
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
    const stateOptions = ["absence", "halfday", "fullday"];
    const attendance = [];

    const userId = 2;

    let day = dayjs().startOf("day").subtract(3, "month");
    const endDay = dayjs().startOf("day");

    while (!day.isAfter(endDay)) {
      if (isBusinessDay(day)) {
        let clockIn, clockOut;
        const state = chance.pickone(stateOptions);

        let clockInHour, clockOutHour;
        switch (state) {
          case "halfday":
            clockInHour = chance.hour({ min: 8, max: 11, twentyfour: true });
            clockIn = dayjs.utc(day).hour(clockInHour).toDate();
            break;
          case "fullday":
            clockInHour = chance.hour({ min: 8, max: 11, twentyfour: true });
            clockOutHour = chance.hour({
              min: clockInHour + 1,
              max: 18,
              twentyfour: true,
            });
            clockIn = dayjs.utc(day).hour(clockInHour).toDate();
            clockOut = dayjs.utc(day).hour(clockOutHour).toDate();
            break;
        }

        attendance.push({
          clock_in: clockIn,
          clock_out: clockOut,
          user_id: userId,
          date: dayjs(day).toDate(),
          state: state,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      day = day.add(1, "day");
    }

    return queryInterface.bulkInsert("Attendances", attendance, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Attendances", null, {});
  },
};
