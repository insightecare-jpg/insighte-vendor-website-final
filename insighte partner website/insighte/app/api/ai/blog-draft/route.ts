import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, tone } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key not configured." }, { status: 500 });
    }

    const systemPrompt = `You are a clinical content writer for Insighte, a premium childcare platform specializing in neurodiverse children (ADHD, Autism, etc.).
Write a well-structured blog post for the following:
Topic: ${topic}
Audience: ${audience} (parent_sanctuary = Parents, clinical_pro = Professionals)
Tone: ${tone}

Return EXACTLY a JSON object with these fields:
- title: A bold, editorial title
- excerpt: A high-impact 2-sentence summary
- html_content: The full article in clean HTML (use <h2>, <h3>, <p>, <ul>, <li>, <blockquote>)
- tags: An array of 3-5 relevant clinical tags
- read_time: Estimated reading time in minutes

Ensure the content is neuro-affirmative, science-backed, and empathetic. Do not include any text outside the JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    const result = await response.json();
    const content = JSON.parse(result.candidates[0].content.parts[0].text);

    return NextResponse.json(content);
  } catch (err) {
    console.error("Gemini Drafting Error:", err);
    return NextResponse.json({ error: "Intelligence Engine Synchronization Failed." }, { status: 500 });
  }
}
