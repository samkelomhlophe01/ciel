document.addEventListener("DOMContentLoaded", () => {
    // 1. BOOT SEQUENCE LOGIC
    const bootScreen = document.getElementById("boot-screen");
    const terminalOutput = document.getElementById("terminal-output");
    const sequence = ["INITIALIZING KERNEL...", "LOADING NEURAL PATHWAYS...", "SYSTEM ONLINE."];
    let currentDelay = 0;
    
    sequence.forEach((line) => {
        const randomTime = Math.floor(Math.random() * 300) + 200;
        currentDelay += randomTime;
        setTimeout(() => {
            const p = document.createElement("p");
            p.className = "terminal-line"; p.textContent = "> " + line;
            terminalOutput.appendChild(p);
        }, currentDelay);
    });
    setTimeout(() => { bootScreen.classList.add("hidden"); }, currentDelay + 800);

    // 2. NEURAL CHAT LOGIC
    const chatLog = document.getElementById("chat-log");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // === NGROK URL ===
    const NGROK_URL = "https://oxidation-cogwheel-opposing.ngrok-free.dev/chat";

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Append user message
        appendMessage(text, "user-msg");
        chatInput.value = "";
        
        // Show typing indicator
        const typingId = appendMessage("Processing...", "ciel-msg");

        try {
            const response = await fetch(NGROK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, user_id: "public_guest" })
            });
            const data = await response.json();
            
            // Remove typing indicator and append real response
            document.getElementById(typingId).remove();
            appendMessage(data.response, "ciel-msg");
        } catch (error) {
            document.getElementById(typingId).remove();
            appendMessage("[SYSTEM ERROR] Neural connection to core severed.", "ciel-msg");
        }
    }

    function appendMessage(text, className) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${className}`;
        msgDiv.textContent = text;
        const id = "msg-" + Date.now();
        msgDiv.id = id;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return id;
    }

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
});