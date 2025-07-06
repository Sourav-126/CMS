import { AuthForm } from "@/components/AuthForm";

export default function SignUp() {
  return (
    <section className="w-full flex h-screen justify-center items-center">
      <AuthForm origin="sign-up" />
    </section>
  );
}
