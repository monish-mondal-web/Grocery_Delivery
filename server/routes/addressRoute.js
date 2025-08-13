import express from "express";
import authUser from "../middleware/authUser.js";
import { addAdress, getAdress } from "../controllers/address.js";

const addressRouter = express.Router();

addressRouter.post("/add", authUser, addAdress);
addressRouter.get("/get", authUser, getAdress);

export default addressRouter;
