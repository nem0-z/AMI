const ws = new WebSocket("ws://localhost:4000");
const calls = new Array();
const activeCalls = document.getElementById("activeCalls");
const usersOnline = document.getElementById("usersOnline");

function updateTime() {
    const timeNode = document.getElementById("updateTime");
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    timeNode.innerHTML = time;
}

function addToRecentEvents(data) {
    const container = document.getElementById("events");
    const recentEvent = document.createElement("p");
    recentEvent.innerHTML = `Event: ${data.event} | Channel: ${data.channel}`;
    container.insertBefore(recentEvent, container.firstChild);
}

function isCallConnected(data) {
    if (data.event == "DialEnd" && data.dialstatus == "ANSWER" && data.destchannelstatedesc == "Up")
        return true;
    return false;
}

function addCallInfo(data) {
    const call = {
        caller: data.channel,
        callee: data.destchannel,
    };
    calls.push(call);
}

function doesCallExist(data) {
    const contact = data.channel;
    for (let i = 0; i < calls.length; i++) {
        if (calls[i].caller == contact || calls[i].callee == contact)
            return i;
    }
    return null;
}

function deleteCallInfo(index) {
    calls.splice(index, 1);
}

function incrementCounter(node) {
    if (node)
        node.innerHTML = parseInt(node.innerHTML) + 1;
}

function decrementCounter(node) {
    if (node)
        node.innerHTML = parseInt(node.innerHTML) - 1;
}

ws.addEventListener("open", () => {
    ws.addEventListener("message", message => {
        const data = JSON.parse(message.data);

        if (isCallConnected(data)) {
            incrementCounter(activeCalls);
            addCallInfo(data);
        }

        if (data.event == "BridgeLeave") {
            const callIndex = doesCallExist(data);
            if (callIndex !== null) {
                deleteCallInfo(callIndex);
                decrementCounter(activeCalls);
            }
        }

        if (data.event == "SuccessfulAuth" && data.accountid != "admin") {
            incrementCounter(usersOnline);
        }

        addToRecentEvents(data);
        updateTime();
    });
});
