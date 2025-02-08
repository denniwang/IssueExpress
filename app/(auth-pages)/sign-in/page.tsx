import { signInAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <SubmitButton pendingText="Signing In..." formAction={signInAction}>
        Sign in
      </SubmitButton>
    </form>
  );
}
