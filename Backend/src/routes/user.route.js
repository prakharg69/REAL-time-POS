import express from "express"
import { Protected } from "../middleware/Protected.js";
import { UserDetail } from "../controller/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/me",Protected,UserDetail)

export default UserRouter;