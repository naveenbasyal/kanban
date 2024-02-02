const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 8000;
// --------- Routes ----------
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const columnRoutes = require("./routes/columnRoutes");
const verifyToken = require("./middlewares/verifyToken");

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected & Server active on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json("Hello worrld");
});

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/board", verifyToken, boardRoutes);
app.use("/api/column", verifyToken, columnRoutes);
app.use("/api/task", taskRoutes);
