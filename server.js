const { exec } = require("child_process");
const WebSocket = require("ws");
// const mysql = require("mysql");
const AMI = require("asterisk-manager");

const wss = new WebSocket.Server({
    port: 4000
});

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "asterisk",
//     password: "test1234",
//     database: "demo1"
// });

// connection.connect((err) => {
//     if (err)
//         throw err;
// })

const ami = new AMI(
    5038,
    "localhost",
    "admin",
    "admin",
    true
);
ami.keepConnected();

wss.on("connection", ws => {
    //ws refers to single connection
    // console.debug("New client connected!");

    ws.on("close", () => {
        // console.debug("Connection closed!");
    });

    ws.on("message", message => {
        const data = JSON.parse(message);

        if (data.action === "dial") {
            const channel = data.channel;
            const extension = data.extension;

            ami.action({
                "action": "originate",
                "channel": channel,
                "exten": extension,
                "context": "sets",
                "priority": 1,
            }, (err, res) => {
                if (err)
                    throw err;
            });
        }
    });

    //Update total number of registered extensions
    exec("asterisk -rx 'pjsip list endpoints' | grep Endpoint: | wc -l", (err, stdout, stderr) => {
        if (err)
            throw err;

        const data = {
            messageType: "info",
            endpointCount: parseInt(stdout) - 1
        };
        ws.send(JSON.stringify(data));
    });

    // Listen for any / all AMI events.
    ami.on("managerevent", (event) => {
        //Ignore VarSet events because why the fuck not
        if (event.event != "VarSet") {
            //Send whole event
            event.messageType = "event";
            ws.send(JSON.stringify(event));
        }
    });

});
