const mongoose = require("mongoose");

require("dotenv").config({ path: ".env" });

const conn = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("DATABASE CONNECTED");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = conn;
