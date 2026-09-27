import dotenv from "dotenv";
import express from "express";
import bootstrap from "./app.bootstrap.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
