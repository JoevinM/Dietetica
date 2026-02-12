import express from "express";
import cors from "cors";

import userRoute from './routes/UserRoutes.js';
import dailyEntryRoute from "./routes/DailyEntryRoute.js";
import appointmentRoute from "./routes/AppointmentRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use("/daily", dailyEntryRoute);
app.use("/appointments", appointmentRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

export default app;
