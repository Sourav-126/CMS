import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Pencil, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ink and Insights",
  description: "...",
};
export default function Landing() {
  return (
    <main className="w-full">
      <section className="flex justify-center h-[50vh] sm:h-[60vh] md:h-[70vh]">
        <div className="flex flex-col justify-center items-center gap-5 text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl tracking-tighter font-bold  sm:text-4xl md:text-5xl lg:text-5xl">
              Manage your Content with Ease
            </h1>
            <p className=" text-gray-400 max-w-[700px] mx-auto">
              Streamline your content workflow, publish with confidence!
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="bg-gray-200 border-2 border-neutral-400 font-[450]
 hover:bg-gray-300  transition-all duration-200 delay-100 text-gray-950 px-4 py-1 rounded-md"
            >
              Get Started!
            </Link>
            <Button className="cursor-pointer" variant={"outline"}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <section className="min-h-screen sm:min-h-[50vh]  bg-gray-600/10 flex justify-center items-center px-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <span className="flex flex-col items-center gap-2">
            <Pencil size={50} />
            <h3 className="text-3xl font-semibold text-gray-100">
              Intuitive Editor
            </h3>
            <p className="text-gray-400 text-center">
              Create and edit content with user friendly Interface
            </p>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Layers size={50} />
            <h3 className="text-3xl font-semibold text-gray-100">
              Flexible Tools
            </h3>
            <p className="text-gray-400 text-center">
              Create and edit content with user friendly Interface
            </p>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Zap size={50} />
            <h3 className="text-3xl font-semibold text-gray-100">
              Blazing Fast
            </h3>
            <p className="text-gray-400 text-center ">
              Create and edit content with user friendly Interface
            </p>
          </span>
        </div>
      </section>
      <section className="h-[60vh] sm:h-[50vh] w-full flex flex-col justify-center items-start ">
        <div className="max-w-[50%] mx-auto space-y-3 ">
          <h4 className="font-bold  text-2xl">
            {" "}
            Ready to Transform your Content Journey?
          </h4>
          <p className=" text-sm  text-gray-400">
            {" "}
            Join Thousand of content creators like you who use CMS
          </p>
          <div className="flex gap-2 ">
            <Input
              className="w-[400px]"
              type="text"
              placeholder="Enter your email"
            />
            <Button variant={"outline"}>Submit</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
