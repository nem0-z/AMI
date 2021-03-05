const users = new Array();
const bridges = new Array();
const agi = new Array();

function addUser(device) {
    const i = users.indexOf(device);
    if (i == -1) {
        users.push(device);
        incrementCounter(usersOnline);
    }
    // const query = `INSERT IGNORE INTO contacts VALUES('${device}');`;
    // ws.send(query);
}

function deleteUser(device) {
    const i = users.indexOf(device);
    users.splice(i, 1);
    decrementCounter(usersOnline);
}

function addBridge(c1, c2) {
    const bridge = {
        caller: c1,
        callee: c2,
    };
    bridges.push(bridge);
}

function userInBridge(data, bridge) {
    return (data.calleridnum == bridge.caller || data.calleridnum == bridge.callee
        || data.connectedlinenum == bridge.caller || data.connectedlinenum == bridge.callee);
}

function emptyBridge(bridge) {
    return (!bridge.caller && !bridge.callee);
}

function removeUserFromBridge(bridge) {
    if (!bridge.caller) {
        bridge.callee = null;
        return;
    }
    bridge.caller = null;
}

function AMIevent(data) {
    if (data.event == "DialBegin") {
        incrementCounter(activeCalls);
    }

    if (data.event == "DialEnd") {
        if (data.dialstatus == "ANSWER") {
            const isValidCall = (data.calleridnum === data.destconnectedlinenum &&
                data.connectedlinenum === data.destcalleridnum);

            if (isValidCall) {
                // addBridge(data.calleridnum, data.connectedlinenum);
                incrementCounter(activeCalls);
            }
        }
    }

    if (data.event == "DeviceStateChange") {
        if (data.state == "UNAVAILABLE")
            deleteUser(data.device);
        else
            addUser(data.device);
    }

    if (data.event == "Newexten" && data.application == "AGI") {
        agi.push(data.extension);
        incrementCounter(activeCalls);
    }

    if (data.event == "Hangup" && data.cause == 16)
        decrementCounter(activeCalls);

    addToRecentEvents(data);
    updateTime();
}