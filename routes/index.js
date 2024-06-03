const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");
router.use("/user", userApi); // /api/user 경로로 라우팅합니다.
router.use("/auth", authApi); // /api/auth 경로로 라우팅합니다.
router.use("/product", productApi);
module.exports = router;
