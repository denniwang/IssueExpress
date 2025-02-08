import { signInAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function Login() {
  return (
    <div id="login-body" className="w-screen h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/login-background.png')" }}>
      <form>
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in to GitHub
        </SubmitButton>
      </form>
    </div>
  );
}
