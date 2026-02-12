import express from "express";
import cors from "cors";

import userRoute from './routes/UserRoutes.js';
import dailyEntryRoute from "./routes/DailyEntryRoute.js";
import appointmentRoute from "./routes/AppointmentRoute.js";
import errorHandler from "./middlewares/ErrorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use("/daily", dailyEntryRoute);
app.use("/appointments", appointmentRoute);

app.use(errorHandler);

export default app;
