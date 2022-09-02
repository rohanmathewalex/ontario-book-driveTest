const User = require('../../models/User')
module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (error || !user || user.userType !== 'driver') return res.redirect('/');
        next();
    })
}
