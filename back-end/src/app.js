import express from "express";
import cors from "cors";

import userRoutes from './routes/UserRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', AuthRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

export default app;
