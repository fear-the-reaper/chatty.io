// as we uploaded the socket.io.js we use this to connect with the server as this will establish the 
// websocket connection with the server thru the client side or in other words:

// CONNECTS TO THE SERVER
const socket = io();

// const button = document.querySelector("#increment");
const $form = document.querySelector("form");
const $formInputButton = $form.querySelector("#sub");
const $sendLoc = $form.querySelector("#sendLoc");
const $msgs = document.querySelector("#messages");
// Okay so doing this can break your program so its better to extract this val thru the form!!!!!
const $message = $form.querySelector("#msg");


// querying query string:
// qs.parse parses the string to ignore the ? we include the second param!
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

// //  Catching the event from the server
// socket.on("updateCount", (count) => {
//     console.log(`the count is ${count}`);
// });

// button.addEventListener("click", (event) => {
//     console.log("nigga clikced");
//     socket.emit("increment");
// });

$form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Subbed form!!!!!!!!!!");
    // now we can get the username and text thru an attribute called target were it stores all the 
    // crap that are inside in form and we can get them thru their name attr!!!!
    const message = e.target.message.value;
    // disable:
    $formInputButton.setAttribute("disabled", "disabled");
    // ================================= EVENTS ACK ======================================
    // when you emit the event thats wherer you do the event validation it is done thru a callback!!!
    // the param list goes thru like dis: socket.emit([EVENT-NAME], {# of data being sent!!!!}, {EVENT-ACK-CALLBACK})   
    socket.emit("sendMessage", message, (ackData) => {
        console.log("message status:", ackData);
        // enabling:
        $formInputButton.removeAttribute("disabled");
        $message.value = "";
        $message.focus();
    });
});

$sendLoc.addEventListener("click", (e) => {
    e.preventDefault();
    if(!navigator.geolocation){
        return alert("Cannot send location not supported in the browser!");
    }
        // disable:
        $sendLoc.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition(position => {
        const data = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        socket.emit("sendLoc", data, (status) => {
            console.log(`Geolocation status: ${status}`);
            $sendLoc.removeAttribute("disabled");
        });
    });
})


socket.on("message", msg => {
    console.log(msg.msg);
        $msgs.innerHTML += `
        <div class="message">
            <p>
                <span class="message_name"> User-kun </span>
                <span class="message_meta"> ${moment(msg.createdAt).format("hh:mm A")} </span>
            </p>
            <p>
                ${msg.msg}    
            </p>
        </div>`
});

socket.on("sendingLocation", data => {
        $msgs.innerHTML += `<div class="usrLoc">
            <h4>Location: ${data.msg} @ ${moment(data.createdAt).format("hh:mm A")}</h4>
        </div>`;
});

socket.emit("join", {username, room}, error => {
    if (error) {
        alert(error);
        location.href("/");
    }
});