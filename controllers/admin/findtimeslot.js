const Appointment  = require("../../models/Appointment");

const findTimeslot = (req, res) => {
    Appointment.find({date: req.query.date}, (error, slots) => {
        let s = slots.map(s => s.time);
        res.json({slots: s});
    })
}
module.exports = findTimeslot;