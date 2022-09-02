const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'Please provide valid username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide valid password']
    },
    userType: {
        type: String,
        default: 'driver'
    },
    firstName: String,
    lastName: String,
    dob: Date,
    licenseNo: String,
    testType: String,
    commentG2: String,
    commentG: String,
    passG2: {
        type: Boolean,
        default: false
    },
    passG: {
        type: Boolean,
        default: false
    },
    appointmentIdG: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    address: {
        houseNo: Number,
        streetName: String,
        city: String,
        province: String,
        postalCode: String
    },
    carInfo: {
        make: String,
        model: String,
        year: Number,
        plateNo: String,
    }
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
    const user = this;
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});
UserSchema.pre('findOneAndUpdate', function(next) {
    const user = this._update;
    user.licenseNo = user.licenseNo ? bcrypt.hashSync(user.licenseNo, 10) : user.licenseNo;
    next();
});

UserSchema.path('dob').get(v => {
    if (!v) return undefined;
    return moment(v).utcOffset(0).format('YYYY-MM-DD');
});

UserSchema.set('toObject', {getters: true});

const User = mongoose.model('User', UserSchema);
module.exports = User;