require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/recomendacao", async (req, res) => {
  const { imc, classificacao } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em saúde e fitness."
        },
        {
          role: "user",
          content: `Meu IMC é ${imc} e estou classificado como ${classificacao}. Me dê uma recomendação simples e prática.`
        }
      ]
    });

    const recomendacao =
      response.choices?.[0]?.message?.content ||
      "Não foi possível gerar recomendação.";

    res.json({ recomendacao });

  } catch (error) {
  console.error("ERRO:", error);

  if (error.message.includes("quota")) {
    return res.json({
      recomendacao: "Serviço de IA indisponível no momento. Tente novamente mais tarde."
    });
  }

  res.status(500).json({
    erro: error.message || "Erro ao gerar recomendação"
  });
}
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));