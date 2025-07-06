"use client";

import { DateFormat } from "@/utils/dateFormat";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditableBlogCards({ post }) {
  const handleDelete = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/delete/${post.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      router.refresh();
    }
  };
  const handleConvertDraft = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/state`,
      {
        method: "PATCH",
        body: JSON.stringify({ id, status: "DRAFT" }),
      }
    );

    if (res.ok) {
      setCurrentStatus("DRAFT");
      router.refresh();
    }
  };
  const PublishBlog = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/state`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: "PUBLISHED" }),
      }
    );

    if (res.ok) {
      setCurrentStatus("PUBLISHED");
      router.refresh();
    }
  };
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(post.Status);
  return (
    <div className="flex ">
      <div className="bg-gray-600/20 p-3 rounded-lg w-full flex gap-3 flex-col sm:justify-between sm:flex-row md:flex-row">
        <div>
          <h2 className="font-bold text-lg">{post.title}</h2>
          <p className="text-sm text-gray-300">
            {post.excerpt.substring(0, 15)}...
          </p>
          <span className="text-xs texy-gray-400">
            {DateFormat(post.createdAt)}
          </span>
        </div>
        <div className="flex gap-2 items-center space-x-2">
          {currentStatus === "PUBLISHED" ? (
            <Button
              className="cursor-pointer"
              onClick={() => {
                handleConvertDraft(post.id);
              }}
              variant="outline"
            >
              Convert to Draft
            </Button>
          ) : (
            <Button onClick={() => PublishBlog(post.id)}>Publish</Button>
          )}
          <Button
            onClick={() => router.push(`/draft/${post.slug}`)}
            variant="outline"
          >
            Edit
          </Button>
          {currentStatus === "PUBLISHED" && (
            <Button onClick={() => router.push(`/blog/${post.slug}`)}>
              View
            </Button>
          )}
          <Trash
            onClick={() => {
              handleDelete(post.id);
            }}
            className="size-5 text-gray-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
