const schedule = require("node-schedule");
const dayjs = require("dayjs");
const isToday = require("dayjs/plugin/isToday");
const db = require("../../models");
dayjs.extend(isToday);

const payroll = schedule.scheduleJob("0 18 L * *", async () => {
  const users = await db.User.findAll({
    where: {
      role_id: 2,
      access_token: "",
    },
    include: {
      model: db.Salary,
    },
  });

  for (const user of users) {
    const start = dayjs().startOf("month");
    const end = dayjs().endOf("month");

    let totalBusiness = 0;
    for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
      if (![0, 6].includes(day.day())) {
        totalBusiness++;
      }
    }

    const salaryPerDay = user.Salary.basic_salary / totalBusiness;

    const attendanceHistory = await db.Attendance.findAll({
      where: {
        user_id: user.id,
        date: {
          [db.Sequelize.Op.between]: [
            dayjs().startOf("month").toDate(),
            dayjs().endOf("month").toDate(),
          ],
        },
      },
    });

    let total = 0;
    let deduction = 0;

    for (const log of attendanceHistory) {
      switch (log.state) {
        case "fullday":
          total += salaryPerDay;
          break;
        case "halfday":
          total += salaryPerDay / 2;
          deduction += salaryPerDay / 2;
          break;
        case "absence":
          deduction += salaryPerDay;
          break;
      }
    }
    await db.Payroll.create({
      user_id: user.id,
      month: dayjs().month() + 1,
      year: dayjs().year(),
      total_amount: total,
      deduction: deduction,
    });
  }
});
