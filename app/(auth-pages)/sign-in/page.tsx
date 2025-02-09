import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import "@fontsource/silkscreen";

export default async function Login() {
  return (
    <div
      id="login-body"
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center font-retro"
      style={{ backgroundImage: "url('/login-background.png')" }}
    >
      <div className="flex flex-col justify-between text-lg" style={{ height: "90%"}}>
        <h1 className="mt-11 text-white text-8xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]" style={{ fontFamily: "Silkscreen, sans-serif" }}>IssueExpress</h1>
        <form className="flex flex-row justify-center">
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in to GitHub
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
