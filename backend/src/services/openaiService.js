const OpenAI = require('openai');

// Verificar se a chave existe
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY não definida no ficheiro .env');
  throw new Error('OPENAI_API_KEY não configurada');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gerarImagemConvite(descricao) {
  try {
    const prompt = `Crie uma imagem de fundo elegante e sofisticada para um convite de ${descricao}. 
    Estilo: clean, profissional, com cores suaves e elementos decorativos subtis. 
    Não inclua texto nem letras. Apenas a imagem de fundo.`;

    const response = await openai.images.generate({
      model: "dall-e-2",           
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url;
  } catch (error) {
    console.error('❌ Erro ao gerar imagem com DALL‑E:', error);
    throw new Error('Falha na geração da imagem: ' + error.message);
  }
}

module.exports = { gerarImagemConvite };