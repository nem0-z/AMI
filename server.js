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

    ws.on("message", query => {
        // console.debug(`Server received a db query: ${query}`);
        // connection.query(query, (err, _) => {
        //     if (err)
        //         throw err;
        // });
    });

    //Update number of extensions
    ami.action({
        "action": "command",
        "command": "pjsip list endpoints"
    }, (err, res) => {
        if (err)
            throw err;

        //Don't look at following lines please
        const endpoints = res.output[res.output.length - 2];
        const endpointsCount = endpoints.split(' ');
        const data = {
            messageType: "info",
            endpointCount: endpointsCount[endpointsCount.length - 1]
        };
        ws.send(JSON.stringify(data));
    });

    // Listen for any / all AMI events.
    ami.on("managerevent", (event) => {
        //Ignore VarSet events
        if (event.event != "VarSet") {
            //Send whole event
            event.messageType = "event";
            ws.send(JSON.stringify(event));
        }
    });

});

// ami.on("managerevent", (event) => {
//     if (event.event != "VarSet") {
//         console.log(event);
//         console.log(' ');
//     }
// });
