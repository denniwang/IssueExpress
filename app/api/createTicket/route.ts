export async function POST(request: Request) {
  try {
    const { githubToken, owner, repoName, title, description, labelName } =
      await request.json();
    
    // Create issue using REST API
    const createIssueResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: description,
          labels: [labelName],
        }),
      }
    );

    const result = await createIssueResponse.json();

    if (!createIssueResponse.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: createIssueResponse.status,
      });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
