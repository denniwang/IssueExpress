import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { githubToken, githubUsername } = await req.json();
  const query = `query {
    user(login: "${githubUsername}") {
      repositories(first: 100, privacy: PUBLIC) {
        nodes {
          id
          name
          description
          url
          visibility
          isPrivate
        }
      }
    }
  }`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${githubToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const githubResponse = await response.json();
  return Response.json(githubResponse);
}
