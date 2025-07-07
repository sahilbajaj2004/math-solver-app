"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Init Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// TEXT-BASED MATH PROBLEM SOLVER
export async function solveMathProblem(_: any, formData: FormData) {
  try {
    const problem = formData.get("problem") as string;
    if (!problem) throw new Error("No problem given");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        text: `You're an expert math tutor. Solve this step-by-step:

Problem: ${problem}

- Explain each step clearly
- Mention formulas used
- Highlight final answer`,
      },
    ]);

    const response = await result.response;
    const text = await response.text();

    return { solution: text };
  } catch (err) {
    console.error("TEXT ERROR:", err);
    return { solution: "❌ Failed to solve text problem." };
  }
}

// IMAGE-BASED MATH PROBLEM SOLVER
export async function solveMathFromImage(_: any, formData: FormData) {
  try {
    const image = formData.get("image") as File;
    if (!image) throw new Error("No image provided");

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: image.type,
          data: base64,
        },
      },
      {
        text: `You're an expert math tutor. Analyze and solve all math problems in this image with step-by-step explanations. If the image is unclear, ask for a clearer one.`,
      },
    ]);

    const response = await result.response;
    const text = await response.text();

    return { solution: text };
  } catch (err) {
    console.error("IMAGE ERROR:", err);
    return { solution: "❌ Failed to solve image problem." };
  }
}
