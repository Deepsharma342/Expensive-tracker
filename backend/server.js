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
const allowedOrigins = [
  "http://localhost:5173",
  "https://fascinating-vacherin-dbed93.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/user', userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



