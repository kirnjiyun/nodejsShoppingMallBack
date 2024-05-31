const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// 회원가입
router.post("/", userController.createUser);

// GET 요청 처리 (예시)
router.get("/", (req, res) => {
    res.send("User endpoint");
});

module.exports = router;
