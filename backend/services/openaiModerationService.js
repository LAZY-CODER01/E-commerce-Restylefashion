/**
 * services/openaiModerationService.js
 * Layer 3 — OpenAI Moderation API for hate speech, sexual content, harassment.
 *
 * Uses the "omni-moderation-latest" model (text-only input, no image).
 * Runs in parallel with AWS Comprehend (Promise.all in the route).
 */

const OpenAI = require("openai");

// Categories we block
const BLOCKED_CATEGORIES = [
  "hate",
  "hate/threatening",
  "harassment",
  "harassment/threatening",
  "sexual",
  "sexual/minors",
  "violence",
  "violence/graphic",
  "self-harm",
  "self-harm/intent",
  "self-harm/instructions",
  "illicit",
  "illicit/violent",
];

let openaiClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Set OPENAI_API_KEY in .env"
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Run text through OpenAI Moderation API.
 * @param {string} text
 * @returns {Promise<{ flagged: boolean, reason: string|null, categories: object }>}
 */
async function moderateContent(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { flagged: false, reason: null, categories: {} };
  }

  const ai = getOpenAIClient();

  const response = await ai.moderations.create({
    model: "omni-moderation-latest",
    input: trimmed,
  });

  const result = response.results?.[0];
  if (!result) {
    return { flagged: false, reason: null, categories: {} };
  }

  if (result.flagged) {
    // Collect which specific categories triggered
    const triggeredCategories = BLOCKED_CATEGORIES.filter(
      (cat) => result.categories?.[cat] === true
    );

    return {
      flagged: true,
      reason: "toxic_content",
      categories: {
        triggered: triggeredCategories,
        scores: Object.fromEntries(
          triggeredCategories.map((cat) => [
            cat,
            result.category_scores?.[cat] ?? 0,
          ])
        ),
      },
    };
  }

  return { flagged: false, reason: null, categories: {} };
}

module.exports = { moderateContent };
