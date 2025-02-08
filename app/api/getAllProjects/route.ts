import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { githubToken, githubUsername } = await req.json();

  const query = `
      query {
        user(login: ${githubUsername}) {
          projectsV2(first: 10) {
            nodes {
              id
              title
              number
              url
            }
          }
        }
      }
    `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${githubToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const githubResponse = await response.json();
  return Response.json(githubResponse.data.user.projectsV2.nodes);
}
