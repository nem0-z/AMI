const ws = new WebSocket("ws://localhost:4000");
const activeCalls = document.getElementById("activeCalls");
const usersOnline = document.getElementById("usersOnline");
const devicesRegistered = document.getElementById("devicesRegistered");
const timeNode = document.getElementById("updateTime");
const container = document.getElementById("events");


function updateTime() {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    timeNode.innerHTML = time;
}

function addCopyListener(event, data) {
    event.addEventListener("click", () => {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = JSON.stringify(data);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert("Copied to clipboard");
    });
}

function addToRecentEvents(data) {
    const recentEvent = document.createElement("button");
    recentEvent.className = "collapsible";
    recentEvent.innerHTML = `Event: ${data.event}`;
    addCopyListener(recentEvent, data);
    container.insertBefore(recentEvent, container.firstChild);
}

function incrementCounter(node) {
    if (node)
        node.innerHTML = parseInt(node.innerHTML) + 1;
}

function decrementCounter(node) {
    if (node) {
        const current = parseInt(node.innerHTML);
        if (current > 0)
            node.innerHTML = current - 1;
    }
}

ws.addEventListener("open", () => {
    ws.addEventListener("message", message => {
        const data = JSON.parse(message.data);

        if (data.messageType === "event") {
            AMIevent(data);
        }
        if (data.messageType === "info") {
            const count = data.endpointCount;
            devicesRegistered.innerHTML = count;
        }
    });
});
