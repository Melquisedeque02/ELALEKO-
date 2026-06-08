require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testImageGeneration() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A cute cat sitting on a chair",
      n: 1,
      size: "1024x1024",
    });
    console.log("✅ Sucesso! URL:", response.data[0].url);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    console.log("Detalhes:", error.error);
  }
}

testImageGeneration();