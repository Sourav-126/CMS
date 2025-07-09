"use server";
export default async function AIContent({
  idea,
  customInstructions,
  contentGen,
}: {
  idea: string;
  customInstructions: string;
  contentGen: boolean;
}) {
  let basePrompt;
  if (contentGen) {
    basePrompt = `
    You are a professional content writer.
    You are given an idea and you need to generate a blog post based on the idea.
    The Content topic is given as follows:${idea}
    The content should be properly bulleted using numbers and be in the points format no need to be formatted!, headings.Below are some custom instructions for the content: ${customInstructions}
    `;
  } else {
    basePrompt = `You are a senior content reviewer.
    Your task is to go through the content and rewrite in easy to understand language.
    The content that you need to repharse is as follows:${idea}
    The content should be properly bulleted using numbers, headings.Below are some custom instructions for the content: ${customInstructions} and no need to give introduction of your role
    `;
  }
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: basePrompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: contentGen ? 1700 : 600,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to generate content");
    }
    const data = await response.json();
    console.log(data);
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
