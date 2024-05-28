const express = require("express");
const router = express.Router();
router.post("/login", authController.loginWithEmail);
module.exports = router;
