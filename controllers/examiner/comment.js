const User = require("../../models/User");
const comment = (req, res) => {
    const vo = {};
    if (req.body.g2_pass_fail) {
        vo.passG2 = req.body.g2_pass_fail === 'true';
    }
    if (req.body.commentTextG2) {
        vo.commentG2 = req.body.commentTextG2;
    }
    if (req.body.g_pass_fail) {
        vo.passG = req.body.g_pass_fail === 'true';
    }
    if (req.body.commentTextG) {
        vo.commentG = req.body.commentTextG;
    }
    User.findByIdAndUpdate(req.body.id, vo, (error, user) => {
        res.redirect('/examiner');
    });
}
module.exports = comment;