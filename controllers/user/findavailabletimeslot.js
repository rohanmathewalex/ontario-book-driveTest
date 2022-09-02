const Appointment = require("../../models/Appointment");

const findAvailableTimeslot = (req, res) => {
    Appointment.find(
      { date: req.query.date, isTimeSlotAvailable: true },
      (error, slots) => {
        let s = slots.map((s) => {
          return {
            id: s._id,
            time: s.time,
          };
        });
        res.json({ slots: s });
      }
    );
  };
  module.exports = findAvailableTimeslot;