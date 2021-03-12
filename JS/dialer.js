const ws = new WebSocket("ws://localhost:4000");

const dashboard = document.getElementById("dashboard");
const submitBtn = document.getElementById("submitBtn");

dashboard.addEventListener("click", () => {
    //Switch between pages
    window.location.href = "index.html";
});

submitBtn.addEventListener("click", () => {
    //Extension and channel will be needed for originate action
    //Notify back end with action property what's up
    const message = {
        action: "dial",
        extension: document.getElementById("extensionInput").value,
        channel: document.getElementById("channelInput").value
    };
    ws.send(JSON.stringify(message));
});