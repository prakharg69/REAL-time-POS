import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import User from "../modules/user.model.js";
import jwt from "jsonwebtoken";
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
export const SignUp = async (req, res) => {
  console.log("api ka andar");

  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const {
      sub: googleId,
      name,
      email,
      picture,
      email_verified,
    } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId,
        fullName: name,
        email,
        profilePhoto: picture,
        emailVerified: email_verified,
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server side error", error: error.message });
  }
};
export const Login = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const { email, email_verified } = ticket.getPayload();
    if (!email_verified) {
      return res.status(401).json({ message: "Email not verified by Google" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }
    user.lastLoginAt = new Date();
    await user.save();
    const token =  jwt.sign({userId:user._id},env.JWT_SECRET,{expiresIn:"7d"});
      res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
export const logOut = async(req,res)=>{
  try {
    console.log(req.cookie);
    
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,      
    sameSite: "Strict", 
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
}