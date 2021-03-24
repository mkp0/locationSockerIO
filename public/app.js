let socket = io();
console.log(socket);
const heading2 = document.getElementById("newLocation");

console.log("room id ", ROOM_ID);

const USER_ID = prompt("your id : ");
const LATI = prompt("Latitude : ");
const LONGI = prompt("Longitude : ");
socket.emit("join-room", ROOM_ID, USER_ID);

socket.emit("new-location", { lat: Number(LATI), long: Number(LONGI) });

socket.on("admin-location", (val) => {
  console.log(val);
});
