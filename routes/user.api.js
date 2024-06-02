const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
// 회원가입
router.post("/", userController.createUser);
//토큰관련
router.get(
    "/me",
    authController.authenticate, //validate한 토큰인지
    userController.getUser //내 토큰 주세요
);
// GET 요청 처리 (예시)
router.get("/", (req, res) => {
    res.send("User endpoint");
});

module.exports = router;
