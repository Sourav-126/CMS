"use client";
import { Feather } from "lucide-react";
import { Icons } from "@/components/Icons";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const onSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google");
    } catch {
      toast.error("Something Wronged with SignIN");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-full flex h-screen justify-center items-center">
      <div className="w-full  mx-4 p-4 rounded-lg sm:w-1/2 md:w-1/3 bg-zinc-800 flex flex-col items-center ">
        <Feather className="size-16 text-gray-400 " />
        <p className="text-sm text-center text-gray-200 py-2">
          Welcome!, by continuing with &nbsp;
          <span className="font-semibold">Ink & Insights </span>you will be part
          of our Community
        </p>
        <button
          onClick={onSignIn}
          className="flex gap-2 items-center bg-gray-500/50 px-8 py-2 rounded-lg text-lg cursor-pointer hover:bg-gray-500/30 transition-opacity duration-200 delay-100"
        >
          <Icons.Google className="size-7" />
          {loading ? "Loading..." : "Sign in"}
        </button>
      </div>
    </section>
  );
}
