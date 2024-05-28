const authController = {};
const User = require("../models/User");
const bcrypt = require("bcryptjs");
authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = await user.generateToken;
                return res.status(200).json({ status: "success", user, token });
            }
        }
        throw new Error("이메일 또는 비밀번호가 틀렸습니다.");
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
};
module.exports = authController;
