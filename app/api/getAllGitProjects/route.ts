import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sessionData, error } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.provider_token;

  const query = `
      query {
        user(login: "DonnyLe") {
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
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const githubResponse = await response.json();
  return Response.json(githubResponse.data.user.projectsV2.nodes);
}
