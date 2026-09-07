function testScript() {
    console.log("JavaScript file connected!");
}
function openSettings() {
    document.querySelector(".app").innerHTML = `
        <h1>⚙️ Settings</h1>

        <p>App की settings यहाँ से manage करें।</p>
        <button onclick="toggleDarkMode()">
    🌙 Dark Mode
</button>
<button onclick="toggleSound()">
    🔊 Sound On/Off
</button>

        <select id="language" onchange="changeLanguage()">
    <option value="hi">हिंदी</option>
    <option value="en">English</option>
</select>
<button onclick="showAbout()">
    ℹ️ About App
</button>
        <button onclick="location.reload()">
            🏠 Home
        </button>
    `;
}

function openImageAI() {
    document.querySelector(".app").innerHTML = `
        <h1>🖼️ Image AI</h1>

        <p>AI से image बनाने के लिए अपना idea लिखें।</p>

        <input
            type="text"
            id="imagePrompt"
            placeholder="जैसे: पहाड़ों में सुंदर सूर्योदय"
            style="
                width: 90%;
                padding: 14px;
                border-radius: 10px;
                border: 1px solid #ccc;
                font-size: 16px;
                margin-bottom: 12px;
            "
        >

        <br>

        <button onclick="generateImage()">
            🖼️ Image बनाएं
        </button>

        <div id="imageResult"></div>

        <br>

        <button onclick="location.reload()">
            🏠 Home
        </button>
    `;
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

async function generateImage() {
    const prompt = document.getElementById("imagePrompt").value.trim();
    const result = document.getElementById("imageResult");

    if (prompt === "") {
        alert("पहले image का idea लिखें।");
        return;
    }

    result.innerHTML = "<p>🖼️ Image बन रही है...</p>";

    try {
        const response = await fetch("/api/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Image नहीं बन पाई");
        }

        result.innerHTML = `
            <img
                src="${data.image}"
                alt="AI Generated Image"
                style="
                    width: 100%;
max-width: 600px;
height: auto;
margin-top: 15px;
border-radius: 15px;
display: block;
margin-left: auto;
margin-right: auto;
                "
            >
        `;

    } catch (error) {
        result.innerHTML = "<p>❌ Image नहीं बन पाई।</p>";
        console.error(error);
    }
    }
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
function toggleSound() {
    const soundOn = localStorage.getItem("soundOn") !== "false";

    localStorage.setItem("soundOn", !soundOn);

    if (!soundOn) {
        alert("🔊 Sound ON");
    } else {
        alert("🔇 Sound OFF");
    }
}
function changeLanguage() {
    const language = document.getElementById("language").value;

    if (language === "en") {
        alert("English selected");
    } else {
        alert("हिंदी चुनी गई");
    }
}
function showAbout() {
    alert("My First App 🚀\nयह मेरी पहली AI Web App है।");
}
function openVoiceAI() {
    document.querySelector(".app").innerHTML = `
        <h1>🎤 Voice AI</h1>

        <p>बोलकर AI से सवाल पूछें।</p>

        <button onclick="startVoiceAI()">
            🎤 बोलना शुरू करें
        </button>

        <p id="voiceText"></p>

        <button onclick="location.reload()">
            🏠 Home
        </button>
    `;
}
function startVoiceAI() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "hi-IN";
    recognition.interimResults = false;

    recognition.onresult = async function(event) {
        const text = event.results[0][0].transcript;

        document.getElementById("voiceText").innerText =
            "आपने कहा: " + text + "\n\nAI जवाब: सोच रहा है...";

        try {
            console.log("Voice AI: API request शुरू");
            const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text
                })
            });

            const data = await response.json();
            console.log("VOICE AI DATA:", data);

            if (!response.ok) {
              throw new Error("API Status: " + response.status);  
            }

            document.getElementById("voiceText").innerText =
                "आपने कहा: " + text + "\n\nAI जवाब: " + data.answer;
            speakAI(data.answer);

        } catch (error) {
    document.getElementById("voiceText").innerText =
        "AI Error: " + JSON.stringify(error);

    console.error(error);
        }
    };

    recognition.onerror = function(event) {
        alert("Voice error: " + event.error);
    };

    recognition.start();
}
function speakAI(text) {
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
