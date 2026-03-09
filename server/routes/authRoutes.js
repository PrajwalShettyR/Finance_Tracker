import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* REGISTER */

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    /* CHECK USERNAME */

    const usernameExists = await User.findOne({ name });

    if (usernameExists) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    /* CHECK EMAIL */

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed
    });

    res.json({
      message: "Registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

/* LOGIN */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid credentials"
      });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({
        message: "Invalid credentials"
      });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

export default router;