/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");
const db = require("./database");
const fileUpload = require("express-fileupload");
const auth = require("./server/middleware/auth");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// app.use(logger("dev"));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);

const port = 7000;

// public routes...
app.use("/api", require("./server/routes/public/publicRoutes"));

// user routes...
app.use("/api/user", auth, require("./server/routes/user/userRoutes"));

// chat routes...
app.use("/api/chat", auth, require("./server/routes/chat/chatroutes"));

// message routes...
app.use("/api/message", auth, require("./server/routes/message/messageRoute"));

// notification routes...
app.use(
  "/api/notification",
  auth,
  require("./server/routes/notification/notificationRoute")
);

// If route not found
app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});

// Error message
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const io = require("socket.io")(server, {
  transports: ["websocket"],
  pingTimeout: 360000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected with socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chatId;
    if (!chat.mem) console.log("Chat.users not defined");

    chat.mem.forEach((user) => {
      if (user === newMessageReceived.sender._id) return;
      socket.in(user).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("notification", (data) => {
    socket.in(data.receiver._id).emit("notification receive", data);
  });

  socket.on("message notification", (newMessage) => {
    console.log("New message as notification: ", newMessage);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing going", true);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", false);
  });
});
