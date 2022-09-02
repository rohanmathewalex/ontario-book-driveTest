const mongoose = require('mongoose');
const moment = require("moment");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
    date: Date,
    time: String,
    isTimeSlotAvailable: Boolean
});

AppointmentSchema.path('date').get(v => {
    if (!v) return undefined;
    return moment(v).utcOffset(0).format('YYYY-MM-DD');
});

AppointmentSchema.set('toObject', {getters: true});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;