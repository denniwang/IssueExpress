import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { githubToken, projectId } = await req.json();

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: 'query { project(id: "' + projectId + '") { name } }',
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
