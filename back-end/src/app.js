const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/user.routes");
const weightRoutes = require("./routes/weight.routes");
const mealRoutes = require("./routes/meal.routes");

app.use(cors());
app.use(express.json());

require("./config/db");

app.use("/users", userRoutes);
app.use("/weights", weightRoutes);
app.use("/meals", mealRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

module.exports = app;
