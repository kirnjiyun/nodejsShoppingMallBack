const User = require("../models/User");
const bcrypt = require("bcryptjs");
const userController = {};

userController.createUser = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        let { email, password, name, level } = req.body;

        // 입력값 검증
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ status: "fail", err: "모든 필드를 입력해주세요." });
        }

        const user = await User.findOne({ email });
        if (user) {
            throw new Error("유저가 이미 존재합니다.");
        }
        const salt = await bcrypt.genSaltSync(5);
        password = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            password,
            name,
            level: level ? level : "customer",
        });
        await newUser.save();
        return res.status(200).json({ status: "success" });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(400).json({ status: "fail", err: err.message });
    }
};
userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (user) {
            res.status(200).json({ status: "success", user });
        }
        throw new Error("Invalid token");
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};
module.exports = userController;
