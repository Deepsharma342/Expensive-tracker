import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: userResponse
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
        
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};