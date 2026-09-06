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

    function sendMessage() {
    let message = document.getElementById("message").value;

    if (message === "") {
        alert("पहले अपना सवाल लिखें।");
        return;
    }

    document.getElementById("answer").innerText =
        "AI Demo: आपने पूछा — " + message;
        }
