"use strict";

require("dotenv").config();
const express = require("express");
// const router = express.Router();
const router = require("./router");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 27017;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(require("./router/index"));

//login

app.use(
  session({
    secret: uuidv4(),

    resave: false,

    saveUninitialized: true,
  })
);

app.use("/router", router);

//

app.set("view engine", "ejs");

const database = require("./database/db");
database();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
