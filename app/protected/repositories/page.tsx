import RoadFooter from "@/app/components/RoadFooter";
import ProjectSelector from "../../components/project-selector";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.provider_token;
  console.log("Access Token", accessToken);

  const response = await fetch("http://localhost:3000/api/getAllRepos", {
    method: "POST",
    body: JSON.stringify({
      githubToken: accessToken,
      githubUsername: user?.user_metadata.user_name,
    }),
  });
  const gitProjects = await response.json();
  console.log("Git Projects", gitProjects);

  return (
    <main className="min-h-screen bg-[#808080] flex flex-col items-center">
      <ProjectSelector repos={gitProjects.data.user.repositories.nodes} />
      <RoadFooter />
    </main>
  );
}
