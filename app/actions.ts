"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Ticket from "./components/Ticket";
import { Project } from "./components/project-selector";

async function signInWithGithub() {
  const supabase = await createClient();

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${defaultUrl}/auth/callback`,
      scopes: "repo project",
    },
  });
  return { data, error };
}
export const signInAction = async () => {
  const { data, error } = await signInWithGithub();
  console.log(data, error);
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};

export const handleSubmit = async (
  approvedTickets: Ticket[],
  selectedProject: Project
) => {
  const defaultUrl = process.env.VERCEL_URL
    ? `${process.env.VERCEL_URL}`
    : "localhost:3000";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.provider_token;

  approvedTickets.forEach(async (ticket) => {
    try {
      const response = await fetch(`http://${defaultUrl}/api/createTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubToken: accessToken,
          owner: user.user_metadata.user_name,
          repoName: selectedProject.name,
          title: ticket.name,
          description: ticket.description,
          labelName: ticket.label,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const result = await response.json();
      console.log("Created ticket:", result);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  });
  return {
    success: {
      link: `https://github.com/${user.user_metadata.user_name}/${selectedProject.name}/issues`,
    },
  };
};
