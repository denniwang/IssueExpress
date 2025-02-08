export async function POST(request: Request) {
  try {
    // Parse the incoming JSON body
    const { githubToken, repositoryId, issueTitle, issueBody } =
      await request.json();

    // Define the GraphQL mutation string.
    const mutation = `
        mutation CreateIssue($input: CreateIssueInput!) {
          createIssue(input: $input) {
            issue {
              number
              title
              url
            }
          }
        }
      `;

    // Set up the variables for the mutation.
    const variables = {
      input: {
        repositoryId, // the ID of the repository (you must fetch or know this beforehand)
        title: issueTitle, // Map issueTitle to title
        body: issueBody, // Map issueBody to body
      },
    };

    // Send the request to GitHub's GraphQL API.
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Use a personal access token with the proper permissions
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    // If the GitHub API returns an error status code, pass it on.
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData }), {
        status: response.status,
      });
    }

    // Parse the GraphQL response.
    const result = await response.json();

    // Return the result as JSON.
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
