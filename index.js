const ws = new WebSocket("ws://localhost:4000");

ws.addEventListener("open", () => {
    console.log("I found a server");

    ws.send("Hello man :)");

    ws.addEventListener("message", message => {
        const data = JSON.parse(message.data);
        // console.log(data);
        if (data.event === "Hangup") {
            console.log("Test");
            const activeCalls = document.getElementById("activeCalls");
            activeCalls.innerHTML = parseInt(activeCalls.innerHTML) + 1;
        }
    });
});
