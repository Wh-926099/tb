import { GoogleGenAI, Type } from "@google/genai";
import { SquareType, LevelType, CardContent } from "../types";
import { SQUARE_NAMES, LEVEL_CONFIG, AWARENESS_TOKENS } from "../constants";

// Initialize the client with API key
// If API key is not set, we'll handle it gracefully in the functions
const getAIClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = "gemini-3-flash-preview";

export const generateCard = async (
  intention: string,
  level: LevelType,
  squareType: SquareType
): Promise<CardContent> => {
  const ai = getAIClient();
  if (!ai) {
    // Return fallback content if API key is not set
    return {
      title: "API Key 未配置",
      description: "请在 GitHub Secrets 中设置 GEMINI_API_KEY 以使用 AI 功能。",
      action: "配置 API Key 后重新部署",
      effect: { awareness: 0, pain: 0, service: 0 }
    };
  }

  // Define the schema for the JSON response
  const cardSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A short, mystical title for the card in Chinese. If an awareness token is provided in the prompt, USE IT as the title." },
      description: { type: Type.STRING, description: "The message of the card in Chinese, relating the square type and specific token to the user's intention." },
      action: { type: Type.STRING, description: "A short instruction for the player in Chinese (e.g. 'Take a deep breath', 'Release expectation')." },
      effect: {
        type: Type.OBJECT,
        properties: {
            awareness: { type: Type.INTEGER, description: "Change in awareness tokens (positive or negative)" },
            pain: { type: Type.INTEGER, description: "Change in pain tokens (positive or negative)" },
            service: { type: Type.INTEGER, description: "Change in service tokens (positive or negative)" },
        },
        description: "The mechanical effect of the card."
      }
    },
    required: ["title", "description", "action", "effect"],
  };

  const levelName = LEVEL_CONFIG[level].name;
  const squareName = SQUARE_NAMES[squareType];

  let specificTokenInstruction = "";
  
  // If it's an Inspiration/Insight square, pick a specific token
  if (squareType === SquareType.INSPIRATION) {
      const tokens = AWARENESS_TOKENS[level];
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      specificTokenInstruction = `
      IMPORTANT: This is an "Inspiration/Insight" (灵感) card. 
      You MUST use the specific Awareness Token: "${randomToken}" as the core theme and Title of this card.
      Explain how "${randomToken}" helps the player with their intention: "${intention}".
      `;
  }

  const prompt = `
    你现在是"蜕变游戏" (Transformation Game) 的游戏引导者 (Game Master)。
    玩家目前处于 "${levelName}" (${level})。
    他们的意图是: "${intention}"。
    他们停在了 "${squareName}" (${squareType}) 格子上。
    
    ${specificTokenInstruction}

    请生成一张卡牌，提供与他们的意图和当前层面相关的具体指引。请使用简体中文回复。
    
    请严格遵循以下规则生成效果 (Effects):
    
    1. INSPIRATION (灵感): 
       - 获得 1-3 个觉知代币 (Awareness). 
       - 0 痛苦 (Pain).
       - 标题必须使用提供的觉知代币名称。
       
    2. OBSTACLE (障碍): 
       - 获得 1-4 个痛苦代币 (Pain) (即"眼泪"). 
       - 0 觉知 (Awareness).
       - 描述必须指出阻碍意图的特定心理或情绪障碍。
       
    3. ANGEL (天使): 
       - 0 觉知, 0 痛苦. 
       - 标题应该是某种天使品质，例如 "慈悲", "勇气", "耐心".
       - 描述应充满支持和爱。
       
    4. SERVICE (服务): 
       - 获得 1 个服务 (Service) 代币.
       - 行动部分应描述对他人或世界的某种服务行为。
       
    5. BLESSING (祝福): 
       - 获得 1 个服务代币 + 1-2 个觉知代币。
       - 行动部分描述将觉知分享给他人。
       
    6. INTUITION (直觉闪电):
       - 这是一张"直觉"卡。AI 判定玩家直觉是否正确。
       - 如果判定正确 (Lightning): 给予 1-2 觉知.
       - 如果判定错误 (Tears): 给予 1 痛苦.
       - 在 Description 中明确说明是"直觉正确"还是"直觉错误"。
       
    7. FREE_WILL (自由意愿):
       - 模拟玩家运用自由意愿做出了选择。
       - 随机给予：觉知 (1-2) 或 移除痛苦 (1-2)。
       
    语气要神秘、支持性强，但也要诚实直接。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: cardSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CardContent;

  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback content if AI fails
    return {
      title: "静默的低语",
      description: "宇宙此刻保持沉默，但你内心的声音知道方向。",
      action: "反思你的意图。",
      effect: { awareness: 1 }
    };
  }
};

export const generateGraduationMessage = async (
    intention: string,
    level: LevelType
): Promise<string> => {
    const ai = getAIClient();
    if (!ai) {
        return "你已晋级到下一个层面。";
    }
    
    const levelName = LEVEL_CONFIG[level].name;
    const prompt = `
    玩家已成功完成了蜕变游戏的 ${levelName}。
    他们的意图是: "${intention}"。
    请写一段简短的祝贺语（2句话），肯定他们在该层面的成长。请使用简体中文。
  `;
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "你已经超越了这个层面。";
    } catch (e) {
        return "你已晋级到下一个层面。";
    }
}
