// okay so behind the scenes express makes us a server automatically now socket.io expects a server
// so what we do is make our own custom server which is basically express + socket.io

const express = require("express");
const hbs = require("hbs");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const {genMsg} = require("./utils/messages");
const { addingUsers, removingUsers, getUser, getUsersInRoom } = require("./utils/trackingUsers");
const app = express();

// creating a server with http:
// basically saying make a server using this shit i.e express!!!!
const server = http.createServer(app);
// custom server!!!!
const io = socketio(server);


// now basically to establish the client-server communication we need to set up a link 
// with the client and server where the io needs to be in the client and server so that 
// the full duplex connection can take place!
// these connections are called websocket connection!


// server set up:
// basically we are looking for an "event" (dw we'll do em later) called connection 
// in which upon connecting with the client do this!!!!!


// ========================== EVENTS =========================================
// now events are the crap that happens like a message, call, connecting, disconnecting and more
// now events can be emitted {sent} and recieved {get} 
// now events can be emitted and recieved by either the clients or the server
// this is a 2 part process we do it on the server AND the client!!!!!! 
// now a socket is only for one client that is connected i.e for that client
// like  if 5 clients are connected and they have a counter
// one updates it only the guy who updated it can see it none of the others can't
// so for we use the io SO
// events can be for nigga/client and for all clients ayt!!!!!!

// ========================== EVENTS ACKNOWLEFGMENTS =========================================
// Basically validating that this event was recieved and sent!!!! 
// server [EMITS EVENT] => client [RECEIVE] --- client sends an ACKNOWLEDGMENT --> TO THE SERVER
// client [EMITS EVENT] => server [RECEIVE] --- server sends an ACKNOWLEDGMENT --> TO THE CLIENT




// let  count = 0;

// now this param is for the specific client that just connected!!!!!
// so if we have 5 clients it'll run feeve time we shall call em socket
io.on("connection", (socket) => {
    console.log("a new weebsocket connection has been established with a client");
    // emitting an event from the server to the client
    // basically saying emit an event on this socket/client
    // 2 params for emit name of event and the thing we want to send to the nigga
    // socket.emit("updateCount", count);

    
    socket.on("join", (userData) => {
        socket.join(room);

        const {error, user} = addingUsers({id: socket.id, ...userData});
        // now we'll message and broadcast room specific:
        // io.to([ROOM]).emit, socket.broadcast.to([room]).emit

        if(error){
            return ackCallback(error);
        }
        socket.emit("message", genMsg("welcome!"));
        socket.to(user.room).broadcast.emit("message", genMsg(`${user.username} has joined!`));
        ackCallback();
        
    });

    // socket.on("increment", () => {
    //     count += 1;
    //     // FO THAT USER
    //     // socket.emit("updateCount", count);
    //     // io.emit("updateCount", count);
    // });
    socket.on("sendMessage", (messageInfo, ackCallback) => {
        const user = getUser(socket.id);
        if (user) {
            // console.log(messageInfo);
            io.to(user.room).emit("message", genMsg(messageInfo));
            // you can send data to the callback toooooooo!!!!!
            return ackCallback(true);
        }
        return ackCallback(false);
    });

    // BROADCASTING EVENTS:
    // okay so what if the users in the chat room to know that a user has entered the chat or left
    // now this is towards every user except THAT user who has done that crap!
    // like if there are 3 users: A B C and A leaves only B n C will notified that A habs left
    // ^ this shit is known as BROADCASTING AN EVENT

    // Broadcasting when a user habs joined
    // so:
    // user disconnecting
    socket.on("disconnect", () => {
        removedUser = removingUsers(socket.id);
        if (removedUser) {
            return io.to(removedUser.room).emit("message", genMsg(`${removedUser.username} has left the chat!`));
        }
    });

    socket.on("sendLoc", (data, ack) => {
        const user = getUser(socket.id);
        if(user){
            const msg = `${data.lat} ${data.long}`;
            io.to(user.room).emit("sendingLocation", genMsg(msg));
            return ack(true);
        }
        return ack(false);
    });

});







const landingPage = path.join(__dirname, "../public");
const viewDir = path.join(__dirname, "../templates/views");

const port = process.env.PORT || 3000;
app.set("view engine", "hbs");
app.set("views", viewDir);
app.use(express.static(landingPage));

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(port, () => {
    console.log("server starting @ ", port);
});