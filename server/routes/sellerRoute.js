import express from 'express';
import { isAuth, logout, sellerLogin } from '../controllers/sellerController.js';
import authSeller from '../middleware/authSeller.js';
const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin)
sellerRouter.get('/is-auth',authSeller, isAuth)
sellerRouter.get('/logout', logout)

export default sellerRouter;