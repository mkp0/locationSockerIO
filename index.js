const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/location/:room", (req, res) => {
  res.render("rooms", { roomId: req.params.room });
});

const location = {};

io.on("connection", (socket) => {
  console.log("new user connected");

  //joining room of userID
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);

    // update new loaction of the admin
    socket.on("new-location", (newLocation) => {
      if (userId === roomId) {
        location.roomId = newLocation;
      }
      io.in(roomId).emit("admin-location", location.roomId);
    });

    // show all new location of admin

    socket.on("disconnect", () => {
      if (userId === roomId) {
        delete location.roomId;
        io.in(roomId).emit("admin-location", location.roomId);
      }
      console.log("a user disconnected");
    });
  });
});

http.listen(5000, () => {
  console.log("http://localhost:5000");
});
