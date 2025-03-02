import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

export default async function Login() {
  return (
    <div
      id="login-body"
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login-background.png')" }}
    >
      <div className="flex flex-col justify-between text-lg" style={{ height: "85%"}}>
        <h1 className="mt-11 text-white text-6xl">IssueExpress</h1>
        <form className="flex flex-row justify-center">
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in to GitHub
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
