import express from "express"
import { Login, SignUp } from "../controller/auth.controller.js";

const AuthRoute = express.Router();

AuthRoute.post("/Signup",SignUp);
AuthRoute.post("/login",Login);

export default AuthRoute;
