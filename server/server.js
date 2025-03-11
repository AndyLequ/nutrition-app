require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api/api");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("Backend running on port");
});
