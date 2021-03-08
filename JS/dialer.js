const ws = new WebSocket("ws://localhost:4000");

const dashboard = document.getElementById("dashboard");
const submitBtn = document.getElementById("submitBtn");

dashboard.addEventListener("click", () => {
    window.location.href = "index.html";
});

submitBtn.addEventListener("click", () => {
    const message = {
        action: "dial",
        extension: document.getElementById("extensionInput").value,
        channel: document.getElementById("channelInput").value
    };
    ws.send(JSON.stringify(message));
});