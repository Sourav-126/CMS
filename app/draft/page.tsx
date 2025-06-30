"use client";

import Editor from "@/components/Editor";

export default async function Draft() {
  const savePost = async ({
    title,
    MetaDescription,
    category,
    content,
    excerpt,
    keywords,
    status,
    slug,
    ogImage,
  }: {
    title: string;
    ogImage: string;
    MetaDescription: string;
    category: string;
    content: string;
    excerpt: string;
    keywords: string;
    status: string;
    slug: string;
  }) => {
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
          ogImage,
        }),
      }
    ).then((res) => res.json());
    if (!res.ok) {
      throw new Error("Post Saving failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl pb-3">Create a New Post</h1>
      <Editor onSave={savePost} />
    </div>
  );
}
