const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const http = require("http");

const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8000;

// ______ Routers  ______
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const columnRoutes = require("./routes/columnRoutes");
const feedbackRoute = require("./routes/feedback");
const verifyToken = require("./middlewares/verifyToken");
const User = require("./models/user");
const Project = require("./models/projects");
const { Board, Column, Task } = require("./models/board");
const Feedback = require("./models/feedback");

dotenv.config();
app.use(express.json());
app.use(cors());

//  Socket connections and events
io.on("connection", (socket) => {
  console.log("Socket connected");

  // _________ Projects __________

  socket.on("projectUpdated", (project) => {
    socket.broadcast.emit("projectUpdated", project);
  });
  socket.on("projectDeleted", (project) => {
    socket.broadcast.emit("projectDeleted", project);
  });
  socket.on("projectStarred", (project) => {
    socket.broadcast.emit("projectStarred", project);
  });
  // _________ Boards __________
  socket.on("boardCreated", (board) => {
    socket.broadcast.emit("boardCreated", board);
  });
  socket.on("boardUpdated", (board) => {
    socket.broadcast.emit("boardUpdated", board);
  });
  socket.on("boardDeleted", (board) => {
    socket.broadcast.emit("boardDeleted", board);
  });
  // _________ Task __________
  socket.on("taskCreated", (task) => {
    socket.broadcast.emit("taskCreated", task);
  });
  socket.on("taskUpdated", (task) => {
    socket.broadcast.emit("taskUpdated", task);
  });
  socket.on("taskDeleted", (task) => {
    socket.broadcast.emit("taskDeleted", task);
  });
  socket.on("taskDraggedInSameColumn", (task) => {
    socket.broadcast.emit("taskDraggedInSameColumn", task);
  });
  socket.on("taskDraggedInDifferentColumn", (task) => {
    socket.broadcast.emit("taskDraggedInDifferentColumn", task);
  });
  socket.on("taskFlagged", (task) => {
    socket.broadcast.emit("taskFlagged", task);
  });
  socket.on("taskAssigned", (task) => {
    socket.broadcast.emit("taskAssigned", task);
  });

  // ______ Column ______
  socket.on("columnCreated", (column) => {
    socket.broadcast.emit("columnCreated", column);
  });
  socket.on("columnNameUpdated", (column) => {
    socket.broadcast.emit("columnNameUpdated", column);
  });
  socket.on("columnLimitUpdated", (column) => {
    socket.broadcast.emit("columnLimitUpdated", column);
  });
  socket.on("columnDeleted", (column) => {
    socket.broadcast.emit("columnDeleted", column);
  });
  socket.on("columnDragged", (column) => {
    socket.broadcast.emit("columnDragged", column);
  });

  // __________ Socket Disconnect __________

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

//  DB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`DB connected & Server active on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//  Base routes
app.get("/", (req, res) => {
  res.json("Hello world");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/board", verifyToken, boardRoutes);
app.use("/api/column", verifyToken, columnRoutes);
app.use("/api/task", verifyToken, taskRoutes);
app.use("/api/feedback", verifyToken, feedbackRoute);

