"use client";
import { Feather } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

export const AuthForm = ({ origin }: { origin: string }) => {
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", { callbackUrl: "/" }); // Optional: set redirect
    } catch (error) {
      toast.error("Something went wrong with sign in");
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-4 p-4 rounded-lg sm:w-1/2 md:w-1/3 bg-zinc-800 flex flex-col items-center">
      <Feather className="size-16 text-gray-400" />
      <p className="text-sm text-center text-gray-200 py-2">
        Welcome! By continuing with{" "}
        <span className="font-semibold">Ink & Insights</span>, you will be part
        of our community.
      </p>
      <button
        onClick={onSignIn}
        disabled={loading}
        className="flex gap-2 items-center bg-gray-500/50 px-8 py-2 rounded-lg text-lg cursor-pointer hover:bg-gray-500/30 transition-opacity duration-200 delay-100 disabled:opacity-60"
      >
        <Icons.Google className="size-7" />
        {loading ? "Loading..." : "Sign in"}
      </button>

      {origin === "sign-up" ? (
        <p className="text-sm text-center text-gray-200 py-2">
          Already have an account?{" "}
          <Link className="text-blue-500 underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      ) : (
        <p className="text-sm text-center text-gray-200 py-2">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-500 underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
};
