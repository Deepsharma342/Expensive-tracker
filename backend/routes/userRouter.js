import express from "express";
import {register,login} from "../controllers/userController.js";
import authMiddleWare from "../middlewares/authMiddleware.js";
import { addIncome,updateIncome,deleteIncome,getIncome } from "../controllers/incomeController.js";
import { addExpense,updateExpense,deleteExpense,getExpenses } from "../controllers/expenseController.js";   

const userRouter = express.Router();

//userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/register", register);

// INCOME
userRouter.post("/add-income", authMiddleWare, addIncome);
userRouter.put("/update-income/:id", authMiddleWare, updateIncome);
userRouter.delete("/delete-income/:id", authMiddleWare, deleteIncome);
userRouter.get("/get-income", authMiddleWare, getIncome);

// EXPENSE
userRouter.post("/add-expense", authMiddleWare, addExpense);
userRouter.put("/update-expense/:id", authMiddleWare, updateExpense);
userRouter.delete("/delete-expense/:id", authMiddleWare, deleteExpense);
userRouter.get("/get-expenses", authMiddleWare, getExpenses);

export default userRouter;
