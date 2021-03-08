const users = new Array();

//Add user to an array if non-existent
function addUser(device) {
    const i = users.indexOf(device);
    if (i === -1) {
        users.push(device);
        incrementCounter(usersOnline);
    }
}

//Delete user from an array if exists
function deleteUser(device) {
    const i = users.indexOf(device);
    if (i !== -1) {
        users.splice(i, 1);
        decrementCounter(usersOnline);
    }
}

function AMIevent(data) {
    if (data.event == "DialBegin") {
        incrementCounter(activeCalls);
    }

    if (data.event == "DialEnd") {
        //Check if caller and callee are matching
        const isValidCall = (data.calleridnum === data.destconnectedlinenum &&
            data.connectedlinenum === data.destcalleridnum);

        if (data.dialstatus == "ANSWER" && isValidCall)
            incrementCounter(activeCalls);
        else
            decrementCounter(activeCalls); //In case someone dialed and other side hung up
    }

    //Get online users by tracking device state
    if (data.event == "DeviceStateChange") {
        if (data.state == "UNAVAILABLE")
            deleteUser(data.device);
        else
            addUser(data.device);
    }

    //This is stupid.
    if (data.event == "Newexten" && data.application == "AGI") {
        incrementCounter(activeCalls);
    }

    //Decrement number of calls on every hangup
    if (data.event == "Hangup" && data.cause == 16) {
        decrementCounter(activeCalls);
    }

    addToRecentEvents(data);
    updateTime();
}