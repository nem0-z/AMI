const ws = new WebSocket("ws://localhost:4000");
const activeCalls = document.getElementById("activeCalls");
const usersOnline = document.getElementById("usersOnline");
const devicesRegistered = document.getElementById("devicesRegistered");
const timeNode = document.getElementById("updateTime");
const eventsContainer = document.getElementById("events");


//Called once on each event received from server, updates time
function updateTime() {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    timeNode.innerHTML = time;
}

//Bezveze se igro 
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

//Stack most recent events on top of each other
function addToRecentEvents(event) {
    const recentEvent = document.createElement("button");
    recentEvent.className = "event";
    recentEvent.innerHTML = `Event: ${event.event}`;
    addCopyListener(recentEvent, event);
    eventsContainer.insertBefore(recentEvent, eventsContainer.firstChild);
}

//Increment the stat in an element
function incrementCounter(node) {
    if (node)
        node.innerHTML = parseInt(node.innerHTML) + 1;
}

//Decrement the stat in an element and perform a sanity check
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
            //This function implements the logic of parsing AMI events
            AMIevent(data);
        }
        if (data.messageType === "info") {
            //Just update the number of registered endpoints
            devicesRegistered.innerHTML = data.endpointCount;
        }
    });
});
