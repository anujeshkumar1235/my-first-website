export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("IMAGE API ERROR:", JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    const imageBase64 = data.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(500).json({
        error: "Image data नहीं मिली।"
      });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${imageBase64}`
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
