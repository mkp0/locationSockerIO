const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/location/:room", (req, res) => {
  res.render("rooms", { roomId: req.params.room });
});

// store the location of user key is user if and location is lat and long
const location = {};

io.on("connection", (socket) => {
  //joining room of userID
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);

    // current admin location or null
    socket.emit("admin-location", location[roomId]);

    // update new loaction of the user
    socket.on("new-location", (newLocation) => {
      location[userId] = newLocation;
      io.in(userId).emit("admin-location", location[userId]);
    });

    // delte location of user on disconnection
    socket.on("disconnect", () => {
      delete location[userId];
      io.in(userId).emit("admin-location", location[userId]);
      console.log("a user disconnected");
    });
  });
});

//connection to server
http.listen(5000, () => {
  console.log("http://localhost:5000");
});
