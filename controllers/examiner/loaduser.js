const User = require("../../models/User");
const loadUser = async (req, res) => {
    let condition = {"$or":[{testType: 'G'}, {testType: 'G2'}]};
    if (req.query.status === 'g') {
        condition = {testType: 'G'};
    } else if (req.query.status === 'g2') {
        condition = {testType: 'G2'};
    }
    const users = await User.find(condition).populate('appointmentId').populate('appointmentIdG');
    res.json({users});
}
module.exports = loadUser;