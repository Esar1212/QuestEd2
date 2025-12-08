import { NextResponse } from 'next/server';

import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: `${process.env.GOOGLE_GEMINI_API}` });
  try {
    const {subject,topic} = await request.json();

  const prompt= `Generate exam questions for the topic "${topic}" in the context of the subject "${subject}".

Output MUST be a JSON object with fields:
{
  "mcq": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": "",
      "marks": ""
    }
  ],
 
  "descriptive": [
    {
      "question": "",
      "answer": "",
      "marks": ""
    }
  ]
}

Rules:
- MCQs must not be ambiguous.
- Descriptive questions must be clear and concise and must reflect the given topic in the context of the given subject.
- DO NOT include any explanations or additional text outside the JSON object.
- Ensure the JSON is properly formatted.`;


    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}`,
  });
    console.log(response.text);
    let mcq = null;
    let descriptive = null;
    try {
      const match = response.text && typeof response.text === "string"
        ? response.text.match(/\{[\s\S]*\}/)  
        : null;
      const parsed = match ? JSON.parse(match[0]) : response.text;
      mcq = parsed.mcq;
      descriptive = parsed.descriptive;
    } catch (e) {
      return NextResponse.json({ error: "Failed to parse model response", raw: response.text }, { status: 500 });
    } 

    return NextResponse.json({ mcq, descriptive }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
