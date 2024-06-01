const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");
const app = express();
require("dotenv").config();

// CORS 설정
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://jiyun-shopping.netlify.app",
            "https://master--jiyun-shopping.netlify.app",
        ], // 허용할 도메인들
        methods: ["GET", "POST"], // 허용할 HTTP 메소드
        allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // req.body 객체로 인식하기 위함
app.use("/api", indexRouter); // 모든 API 라우트는 /api로 시작합니다.

// MongoDB URI 설정
const mongoURI =
    process.env.DB_ADDRESS ||
    "mongodb+srv://kjyun2187:rlawldbs2514@cluster0.srjsf9z.mongodb.net/shopping";

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongoose connected");
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
