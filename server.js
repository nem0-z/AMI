const { exec } = require("child_process");
const WebSocket = require("ws");
const AMI = require("asterisk-manager");

const wss = new WebSocket.Server({
    port: 4000
});

const port = process.argv[2];
const host = process.argv[3];
const user = process.argv[4];
const pw = process.argv[5];

const ami = new AMI(
    port,
    host,
    user,
    pw,
    true
);
ami.keepConnected();

wss.on("connection", ws => {
    //ws refers to single connection

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
    exec("asterisk -rx 'pjsip list endpoints' | grep Endpoint: | wc -l",
        (err, stdout, stderr) => {
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
            //Send whole event and add messageType property to it so front end can now what's up
            event.messageType = "event";
            ws.send(JSON.stringify(event));
        }
    });

});
