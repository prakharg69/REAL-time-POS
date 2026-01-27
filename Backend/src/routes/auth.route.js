import express from "express"
import { Login, SignUp } from "../controller/auth.controller.js";

const AuthRoute = express.Router();

AuthRoute.post("/SignIn",SignUp);
AuthRoute.get("/login",Login);

export default AuthRoute;
