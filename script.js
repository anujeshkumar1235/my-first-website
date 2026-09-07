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

        <p id="answer"></p>

        <button onclick="location.reload()">
            🏠 Home
        </button>
    `;
}

async function sendMessage() {
    const message = document.getElementById("message").value.trim();
    const answer = document.getElementById("answer");

    if (message === "") {
        alert("पहले अपना सवाल लिखें।");
        return;
    }

    answer.innerText = "AI सोच रहा है...";

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

        answer.innerText = data.answer;

    } catch (error) {
        answer.innerText = "AI से जवाब नहीं मिल पाया।";
        console.error(error);
    }
}
