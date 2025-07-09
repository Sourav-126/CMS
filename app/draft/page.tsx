"use client";

import Editor from "@/components/Editor";
import { useState } from "react";

export default function Draft() {
  const [loading, setLoading] = useState(false);

  const savePost = async ({
    title,
    MetaDescription,
    category,
    content,
    excerpt,
    keywords,
    status,
    slug,
    thumbnail,
  }: {
    title: string;
    thumbnail?: string;
    MetaDescription: string | null;
    category: string;
    content: string;
    excerpt: string;
    keywords: string;
    status: string;
    slug: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            MetaDescription,
            category,
            content,
            excerpt,
            keywords,
            status,
            slug,
            thumbnail,
          }),
        }
      );

      if (!res.ok) {
        console.log(res);
        throw new Error("Post Saving failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl pb-3">Create a New Post</h1>
      <Editor onSave={savePost} />
      {loading && <div>Saving...</div>}
    </div>
  );
}
