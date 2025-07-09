"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PostWithAuthor {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    image: string;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_NEXT_URL
          }/api/v1/search?query=${encodeURIComponent(query)}`
        );
        if (!res.ok) {
          if (res.status == 404) {
            return setError("No post found");
          }
        } else {
          setError("");
        }
        const foundPost: PostWithAuthor[] = await res.json();

        setResults(foundPost);
      } catch {
        console.log("no Post found in search page");
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      const timer = setTimeout(() => fetchPosts(), 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setError("");
    }
  }, [query]);

  return (
    <section className="w-full min-h-screen flex flex-col gap-3 p-8">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search for a post"
      />
      {loading && "Loading..."}
      {query && (
        <ul className="flex flex-col gap-2">
          {error ? (
            <div>{error}</div>
          ) : (
            results.map((post) => {
              return (
                <li
                  key={post.id}
                  className="bg-gray-500/10 p-3 rounded hover:scale-[1.01] transition-all duration-200"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-gray-100 text-lg font-bold">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {post.excerpt.substring(0, 30)}
                    </p>
                    <div className="flex items-center gap-2 text-xs mt-3">
                      Written by:
                      <Image
                        src={post.author.image}
                        width={10}
                        height={10}
                        alt="authorImage"
                      />
                      <p className="text-xs text-gray-200">
                        {post.author.name}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      )}
    </section>
  );
}
