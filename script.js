function testScript() {
    console.log("JavaScript file connected!");
}

function openAI() {
    document.querySelector(".app").innerHTML = `
        <h1>🤖 AI Chat</h1>

        <p>यहाँ आप AI से बात कर सकते हैं।</p>

        <input
            type="text"
            id="message"
            placeholder="अपना सवाल लिखें..."
            style="
                width: 90%;
                padding: 14px;
                border-radius: 10px;
                border: 1px solid #ccc;
                font-size: 16px;
                margin-bottom: 12px;
            "
        >

        <button onclick="sendMessage()">
            भेजें
        </button>
        <button onclick="startVoice()">
    🎤 Voice
</button>

        <div id="chat"></div>

        <button onclick="clearChat()">
            🗑️ Clear Chat
        </button>

        <button onclick="location.reload()">
            🏠 Home
        </button>
    `;

    loadChatHistory();

    document.getElementById("message").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const messageInput = document.getElementById("message");
    const chat = document.getElementById("chat");

    const message = messageInput.value.trim();

    if (message === "") {
        alert("पहले अपना सवाल लिखें।");
        return;
    }

    chat.innerHTML += `<p><b>आप:</b> ${message}</p>`;
    chat.innerHTML += `<p id="loading"><b>AI:</b> सोच रहा है...</p>`;

    messageInput.value = "";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "कुछ समस्या हुई");
        }

        const formattedAnswer = data.answer
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

document.getElementById("loading").innerHTML =
    `<b>AI:</b> ${formattedAnswer}`;

        saveChatHistory();

    } catch (error) {
        document.getElementById("loading").innerText =
            "AI से जवाब नहीं मिल पाया।";

        console.error(error);
    }
}

function saveChatHistory() {
    const chat = document.getElementById("chat").innerHTML;
    localStorage.setItem("aiChatHistory", chat);
}

function loadChatHistory() {
    const savedChat = localStorage.getItem("aiChatHistory");

    if (savedChat) {
        document.getElementById("chat").innerHTML = savedChat;
    }
}

function clearChat() {
    document.getElementById("chat").innerHTML = "";
    localStorage.removeItem("aiChatHistory");
}
function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "hi-IN";
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;

        document.getElementById("message").value = text;
    };

    recognition.onerror = function() {
        alert("Voice input काम नहीं कर पाया।");
    };

    recognition.start();
}
