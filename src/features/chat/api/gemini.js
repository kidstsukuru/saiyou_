import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

/**
 * Gemini APIクライアントを初期化
 */
function getClient() {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

/**
 * Gemini 2.0 Flash で応答を生成
 * @param {string} systemPrompt - システムプロンプト
 * @param {string} userMessage - ユーザーの質問
 * @param {Array<{role: string, content: string}>} history - 会話履歴
 * @returns {Promise<string>} - 生成された回答
 */
export async function generateResponse(systemPrompt, userMessage, history = []) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  // 会話履歴をGemini APIのフォーマットに変換
  const chatHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.3, // 低めで事実ベースの回答を促進
    },
  });

  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API_RATE_LIMITED');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('API_TIMEOUT');
    }
    throw error;
  }
}
