const axios = require("axios");
// require("dotenv").config();

export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: message,
        chat_history: [], // Optional: add chat memory here
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.text;
    res.json({ reply });
  } catch (error) {
    console.error("Cohere Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with Cohere." });
  }
};
