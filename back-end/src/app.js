const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

module.exports = app;
