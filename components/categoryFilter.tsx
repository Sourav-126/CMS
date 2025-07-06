"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState(searchParams.get("cat") || "");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("cat", category);
    router.push(`?${params.toString()}`);
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap=2">
      <Input
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        className="w-[300px]"
        placeholder="Search By Category"
      />
      <Button className="cursor-pointer" type="submit">
        Search
      </Button>
    </form>
  );
}
