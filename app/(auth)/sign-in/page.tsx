import { AuthForm } from "@/components/AuthForm";

export default function SignIn() {
  return (
    <section className="w-full flex h-screen justify-center items-center">
      <AuthForm origin="sign-in" />
    </section>
  );
}
