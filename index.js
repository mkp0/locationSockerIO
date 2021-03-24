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
const locations = {};

io.on("connection", (socket) => {
  // update new loaction of the user
  socket.on("new-location", (locate) => {
    locations[locate.userId] = locate.location;
    io.in(locate.userId).emit("admin-location", locate.location);
    console.log(locations);
  });

  //joining room of userID
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);

    // current admin location or null
    socket.emit("admin-location", locations[roomId]);

    // delte location of user on disconnection
    socket.on("disconnect", () => {
      delete locations[userId];
      io.in(userId).emit("admin-location", locations[userId]);
      console.log("a user disconnected");
    });
  });
});

//connection to server
http.listen(5000, () => {
  console.log("http://localhost:5000");
});
