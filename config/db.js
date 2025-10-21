require("dotenv").config();

const mongoose = require("mongoose");

const dburl = process.env.DB_URI;

const connectDB = async () => {
  await mongoose
    .connect(dburl)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.log("DB Connection Failed: " + error);
    });
};

module.exports = connectDB;