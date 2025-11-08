
import { GoogleGenAI } from "@google/genai";
import { Industry, RoiResult, AllInputs } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll proceed assuming it's set in the environment.
  console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const formatInputs = (inputs: AllInputs): string => {
  return Object.entries(inputs)
    .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
    .join('\n');
};

export const generateAutomationInsights = async (
  industry: Industry,
  inputs: AllInputs,
  results: RoiResult
): Promise<string> => {
  const prompt = `
    You are an expert business automation consultant.
    A prospect from the "${industry}" industry has used an ROI calculator and received the following results:
    - Monthly Savings: $${results.monthlySavings.toFixed(2)}
    - Annual Savings: $${results.annualSavings.toFixed(2)}
    - Payback Period: ${results.paybackMonths.toFixed(1)} months
    - Annual ROI: ${results.annualROI.toFixed(0)}%
    - Key Improvement: ${results.keyMetric}
    
    The prospect's business metrics are:
    ${formatInputs(inputs)}

    Based on this data, provide a short, compelling analysis (2-3 paragraphs) under the bolded title "**What Gets Automated?**".
    Explain SPECIFICALLY what automation can do for THEIR business.
    Use a professional, encouraging, and benefit-driven tone.
    Focus on translating their inputs and the ROI results into tangible business outcomes.
    Do not just repeat the numbers; interpret them.

    After the main analysis, add a new section. Start this section with the bolded title "**Next-Level Automation for ${industry}**".
    Now, think like a top-tier strategy consultant. Go beyond the obvious. Suggest 1-2 highly specific, CREATIVE, and tangible automation ideas that are directly inspired by the prospect's provided metrics but are *not* covered by the basic ROI calculation. These should be innovative ideas that could genuinely give them a competitive edge.
    For example, for a construction company, instead of just "automated invoicing", suggest something like "**AI-Powered Bid Analysis**" to scan tender documents for risks and opportunities.
    Prefix each example with a bullet point character like '* '.
    Each suggestion must have a bolded title followed by a short, powerful explanation of the business value.

    IMPORTANT: Format the output using only bolding (with **text**) for titles and newlines for paragraphs and list items. Do not use any other markdown like headers (#) or list syntax.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
};

export const generateSalesEmail = async (
  industry: Industry,
  results: RoiResult
): Promise<string> => {
  const prompt = `
    You are an expert sales copywriter specializing in B2B automation solutions.
    A prospect in the "${industry}" industry has just calculated their ROI and it's impressive. Here are their numbers:
    - Annual Savings: $${results.annualSavings.toFixed(0)}
    - Payback Period: ${results.paybackMonths.toFixed(1)} months
    - Annual ROI: ${results.annualROI.toFixed(0)}%

    Generate a concise, professional email draft that this prospect could send to their boss or decision-maker to justify investing in automation.
    The email should:
    1.  Have a clear and compelling subject line.
    2.  Start by stating the potential financial impact discovered. Weave these specific numbers (the annual savings, ROI, and payback period) directly into the opening sentences to make it highly personalized and data-driven.
    3.  Briefly mention the key benefits (e.g., cost savings, efficiency, revenue capture).
    4.  Suggest the next step (e.g., "I'd like to schedule a brief call to discuss this further").
    5.  Be easily editable with placeholders like [Your Name] and [Company Name].
    
    Keep the tone proactive and data-driven.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating email:", error);
    throw error;
  }
};

export const generateVideoPitch = async (
    industry: Industry,
    results: RoiResult,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    // Re-create AI instance for key freshness in environments like AI Studio
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    // 1. Generate script
    const scriptPrompt = `Create a short, punchy 15-second video script to present to a business executive in the ${industry} industry. The script should highlight these incredible ROI results: Annual Savings of $${results.annualSavings.toFixed(0)} and an Annual ROI of ${results.annualROI.toFixed(0)}%. The tone should be professional and exciting. Just provide the voiceover script, no scene directions.`;
    
    const scriptResponse = await freshAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: scriptPrompt,
    });
    const script = scriptResponse.text;

    // 2. Generate video
    const videoPrompt = `An exciting, professional corporate video with dynamic charts and graphs showing positive growth. Abstract visuals representing the ${industry} industry. The overall mood is optimistic and successful. Voiceover: "${script}"`;
    
    let operation = await freshAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    // 3. Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await freshAi.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        // Fix: The API key must be appended to the download link to fetch the video.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } else {
        throw new Error("Video generation completed, but no download link was found.");
    }
};
