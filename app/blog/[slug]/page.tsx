import { DateFormat } from "@/utils/dateFormat";
import { Calendar } from "lucide-react";
import Image from "next/image";
import "../../styles/blog.css";
import { notFound } from "next/navigation";
import Link from "next/link";

const fetchSingleBlog = async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/get/${slug}`,
    { next: { tags: ["slug"] } }
  );
  if (res.status === 404) {
    notFound();
  }
  const data = await res.json();
  return data;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const param = await params;
  const res = await fetchSingleBlog(param.slug);

  return {
    title: res.title,
    description: res.excerpt,
    openGraph: {
      images: [res.thumbnail],
    },
  };
}

export default async function SingleBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchSingleBlog(slug);

  return (
    <section>
      <div className="flex items-center flex-col gap-4">
        {post.thumbnail && (
          <Image
            className="rounded border w-[90%] md:w-[350px]"
            src={post.thumbnail}
            width={200}
            height={50}
            alt="Page title"
          />
        )}
        <h1 className="text-2xl md:text-5xl font-bold">{post.title}</h1>
        <div className="meta-of-a-blog space-y-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 items-center">
              <Calendar className="text-gray-400 size-4" />
              <p className="text-gray-400 text-xs">
                Created on: {DateFormat(post.createdAt)}
              </p>
            </div>
            <Link
              className="flex items-center gap-2"
              href={`/user/${post.authorId}`}
            >
              <Image
                className="rounded-full"
                src={post.author.image}
                width={20}
                height={20}
                alt="author"
              />
              <p className="text-xs text-gray-400">{post.author.name}</p>
            </Link>
          </div>
          <div className="text-xs flex items-center gap-2">
            <p>Category:</p>
            <p className="badge border border-gray-700 w-fit px-2 py-1 rounded bg-gray-600/30">
              {post.catSlug}
            </p>
          </div>
          {post?.keywords && (
            <div className="text-xs flex items-center gap-2">
              <p>Tags:</p>
              {post.keywords.split(",").map((tag: string, index: number) => (
                <p
                  key={index}
                  className="badge border border-gray-700 w-fit px-2 py-1 rounded bg-gray-600/30"
                >
                  {tag}
                </p>
              ))}
            </div>
          )}
        </div>
        <div
          className="blogContent text-sm w-[90%] md:w-2/3 text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </section>
  );
}
