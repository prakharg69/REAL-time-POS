import express from "express"
import { Login, logOut, SignUp } from "../controller/auth.controller.js";

const AuthRoute = express.Router();

AuthRoute.post("/Signup",SignUp);
AuthRoute.post("/login",Login);
AuthRoute.get("/logout",logOut);

export default AuthRoute;
