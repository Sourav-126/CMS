"use client";
import Editor from "@/components/Editor";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";

type PostType = {
  title: string;
  ogImage: string;
  MetaDescription: string;
  category: string;
  content: string;
  excerpts: string;
  keywords: string;
  status: string;
};

interface EditDraftProps {
  params: Promise<{ slug: string }>;
}

export default function EditDraft({ params }: EditDraftProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const [post, setPost] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("No slug provided");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/update/${slug}`
        );

        if (res.status === 403) {
          toast.error("You are not allowed to change the post");
          setError("Access denied");
          return;
        }

        if (res.status === 500) {
          toast.error("Server error occurred");
          setError("Internal server error");
          return;
        }

        if (!res.ok) {
          toast.error("Cannot fetch the post");
          setError(`HTTP ${res.status}: ${res.statusText}`);
          return;
        }

        const data = await res.json();
        setPost(data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Something went wrong");
        setError(errorMessage);
        console.error("Fetch error:", error);
      }
    };

    fetchPost();
  }, [slug]);

  const savePost = async (updatedPost: PostType) => {
    if (!slug) {
      throw new Error("No slug available");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/update/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error("Post updating failed");
    }
    return data;
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Error Loading Post</h2>
          <p>{error}</p>
          <p className="text-sm mt-2">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="p-8 text-gray-500">Loading post...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl pb-3">Edit Post</h1>
      <Editor onSave={savePost} initialData={post} />
    </div>
  );
}
