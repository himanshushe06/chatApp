import express from "express"
import cors from "cors";
import connectDb from "./Db/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRoutes from "./routes/chat.route.js";
import otpRoutes from "./routes/otp.routes.js";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app = express()
connectDb()
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
//middelware
app.use(express.json())
app.use(cookieParser())
//routes
app.use("/auth", authRoutes);       //register and login routes
app.use("/users", userRoutes);     //get user details and search users routes
app.use("/messages", messageRoutes);    //send and get messages routes
app.use("/chats", chatRoutes);
app.use("/otp", otpRoutes);    //get chats routes
export default app;