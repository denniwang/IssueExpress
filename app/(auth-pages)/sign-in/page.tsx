import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

export default async function Login() {
  return (
    <div
      id="login-body"
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login-background.png')" }}
    >
      <div className="flex flex-col justify-between" style={{ height: "95%"}}>
        <h1 className="text-white text-3xl">Project Name</h1>
        <form>
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in to GitHub
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
