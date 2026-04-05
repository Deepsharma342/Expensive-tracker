import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import userRouter from "./routes/userRouter.js";
import "./models/userSchema.js";


dotenv.config();



const app = express();
const PORT = process.env.PORT || 4000;


connectDB();

app.use(express.json());
app.use(cors({
  origin: "https://glittering-capybara-93ed98.netlify.app/api",
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/user', userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



