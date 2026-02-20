import express from "express";
import cors from "cors";


import userRoute from './routes/UserRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import dailyEntryRoute from "./routes/DailyEntryRoute.js";
import appointmentRoute from "./routes/AppointmentRoute.js";
import errorHandler from "./middlewares/ErrorHandler.js";
import dieticianRoute from "./routes/DieticianRoute.js";
import newsletterRoute from "./routes/NewsletterRoute.js";
import calendarRoutes from './routes/calendarRoute.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/users', userRoute);
app.use('/auth', AuthRoutes);
app.use("/daily", dailyEntryRoute);
app.use("/appointments", appointmentRoute);
app.use("/dieticians", dieticianRoute);
app.use("/newsletters", newsletterRoute);
app.use('/', calendarRoutes);

app.use(errorHandler);

export default app;
