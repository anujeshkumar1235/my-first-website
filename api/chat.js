export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        tools: [
          {
            type: "web_search"
          }
        ],
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENAI ERROR:", JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    console.log("AI RESPONSE:", JSON.stringify(data));

    const answer =
  data.output_text ||
  data.output
    ?.filter(item => item.type === "message")
    ?.flatMap(item => item.content || [])
    ?.filter(content => content.type === "output_text")
    ?.map(content => content.text)
    ?.join("\n") ||
  "";

if (!answer) {
    
      return res.status(200).json({
        answer: "AI ने कोई टेक्स्ट जवाब नहीं दिया।"
      });
    }

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
