import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fetch from "node-fetch";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_ID = process.env.GITHUB_PROJECT_ID;

// Existing POST function for creating GitHub tickets
export async function POST(req: Request) {
  try {
    const {
      githubToken,
      projectId,
      title,
      body,
      assignee,
      label,
      description,
    } = await req.json();

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `
          mutation {
            addProjectV2ItemById(input: {projectId: "${projectId}", contentId: "${title}"}) {
              item {
                id
              }
            }
          }

        `,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.errors[0]?.message || "Unknown error occurred",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error creating GitHub ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating GitHub ticket",
      },
      { status: 500 }
    );
  }
}

// New function to handle sending chat data to GitHub
export async function sendToGit(req: Request) {
  try {
    // Parse incoming JSON body
    const { userInput } = await req.json();
    console.log("User Input: " + userInput);



    return NextResponse.json({
      success: true,
      data: rawResponse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error processing chat data",
      },
      { status: 500 }
    );
  }
}
