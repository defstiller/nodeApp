import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config.js";
import UserModel from "./models/User.js";
import { loginValidation } from "./validations.js";
import bcrypt from "bcrypt";
import { loginHelper, signUpHelper } from "./helpers/authHelpers.js";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.body.email);
  res.send("Hello there!");
});

app.post("/auth/register", (req, res) => {
  signUpHelper(UserModel, res, req);
});
app.post("/auth/login", loginValidation, (req, res) => {
  loginHelper(
    UserModel,
    "Invalid email or password",
    "User logged in successfully",
    res,
    req
  );
});
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});
