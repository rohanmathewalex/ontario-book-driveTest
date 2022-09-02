const { monthsShort } = require("moment");
const Appointment  = require("../../models/Appointment");
const { schema } = require("../../models/User");

const saveTimeslots = (req, res) => {
    const date = req.body.appointmentDate;
    let slotSelected = req.body.selectedSlots;
    const result = slotSelected.substring(0, slotSelected.length - 1)
        .split(',')
        .map(v => {
            return {
                date: date,
                time: v,
                isTimeSlotAvailable: true
            }
        });
    Appointment.create(result, error => {
        if (error == null) {
            res.render('appointment', {code: 200});
        } else {
            res.render('appointment', {code: 500, message: error});
        }
    });
}
module.exports = saveTimeslots;