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
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"], // Authorization 헤더 허용
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // req.body 객체로 인식하기 위함
app.use("/api", indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose
    .connect(mongoURI)
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
