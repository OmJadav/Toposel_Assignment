import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  gender: Joi.string().required(),
  dob: Joi.string().required(),
  country: Joi.string().required(),
});

const userRegister = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { username, email, password, fullName, gender, dob, country } =
      req.body;
    const alreadyUser = await User.findOne({ $or: [{ email }, { username }] });
    if (alreadyUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      gender,
      dob,
      country,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const searchUser = async (req, res, next) => {
  try {
    const { query } = req.query;
    const user = await User.findOne(
      { $or: [{ username: query }, { email: query }] },
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export { userRegister, userLogin, searchUser };
