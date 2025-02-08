import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are meant to extract actionable tasks from the Zoom meeting transcript and generate structured
tickets in JSON format. Identify tasks, determine the assignee (if unspecified, use "Unassigned"),
create a concise ticket name prefixed with the number that was mentioned from the transcript or if
it was unmentioned generate your own random 3-digit number. Assign a relevant label from "developer work,"
"feature," "design," or "bug fix," depending on what the ticket sounds closest to, and provide a clear
description of the task that was outlined. Output each ticket as a JSON object with properties for "assignee",
"name", "label", and "description", strictly following this structure without deviation. Ensure proper
JSON syntax and exclude general discussions, focusing only on relevant work-related tasks. Your only
objective is to return a list of these JSON objects for each ticket mentioned in the transcript. Do
not return anything but these JSON objects followed by commas.`;

export async function POST(req: Request) {
  try {
    // Parse incoming JSON body
    const { userInput } = await req.json();

    // Combine the system prompt with the user's input
    const fullPrompt = `${systemPrompt}\n\nTranscript:\n${userInput}`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      data: rawResponse,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error contacting Groq API",
      },
      { status: 500 }
    );
  }
}
