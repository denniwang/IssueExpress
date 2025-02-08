export async function POST(req: Request) {
  const { repositoryId, issueTitle, issueBody, githubToken } = await req.json();
  const query = `const query = mutation {
  createIssue(input: {
    repositoryId: "${repositoryId}",
    title: "${issueTitle}",
    body: "${issueBody}"
  }) {
    issue {
      id
      number
      title
      url
    }
  }
};`;

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
