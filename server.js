const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 4000
});

const ami = new require("asterisk-manager")(
    5038,
    "localhost",
    "admin",
    "admin",
    true
);
// In case of any connectivity problems
ami.keepConnected();

wss.on("connection", ws => {
    //ws refers to single connection
    console.log("New client connected!");

    ws.on("close", () => {
        console.log("Connection closed!");
    });

    ws.on("message", data => {
        console.log(`Server received a message: ${data}`);
    });

    // Listen for any / all AMI events.
    ami.on("managerevent", (event) => {
        // console.log(event);
        ws.send(JSON.stringify(event));
    });

    // ami.on("bridgeenter", (event) => {
    //     // console.log(event);
    //     ws.send(JSON.stringify(event));
    // });
});
