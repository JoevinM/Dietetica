const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/UserRoutes");
const weightRoutes = require("./routes/WeightRoutes");
const mealRoutes = require("./routes/MealRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const activityRoutes = require("./routes/ActivityRoutes");
const newsletterRoutes = require("./routes/NewsletterRoutes");

app.use(cors());
app.use(express.json());

require("./config/db");

app.use("/users", userRoutes);
app.use("/weights", weightRoutes);
app.use("/meals", mealRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/activities", activityRoutes);
app.use("/newsletters", newsletterRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

module.exports = app;
