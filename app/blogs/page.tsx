import { url } from "inspector";
import Image from "next/image";
import Link from "next/link";

const fetchAllBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_URL}/api/v1/get`);
  const data = await res.json();
  return data;
};

export default async function Blogs() {
  const blogData = await fetchAllBlogs();
  return (
    <section className="grid grid-cols-3  gap-4 md:grid-cols-5 p-8">
      {blogData.map((blog, index) => {
        return (
          <BlogCard
            key={index}
            title={blog.title}
            thumbnail={blog.thumbnail}
            excerpt={blog.excerpt}
            url={blog.slug}
          />
        );
      })}
    </section>
  );
}

const BlogCard = ({
  title,
  excerpt,
  thumbnail,
  url,
}: {
  title: string;
  excerpt: string;
  thumbnail: string;
  url: string;
}) => {
  return (
    <div className="bg-gray-600/20 rounded-lg border  flex flex-col p-1 gap-1 hover:scale-103 transition duration-300 delay-100">
      <Image
        className="object-cover w-full rounded-md "
        src={thumbnail}
        height={150}
        width={300}
        alt={title}
      />
      <h2 className="text-xl font-bold text-gray-200">{title}</h2>
      <p className="text-sm  text-gray-400"> {excerpt}</p>
      <Link
        className="bg-zinc-600/70 py-2 px-3 rounded w-fit text-xsm"
        href={`/blog/${url}`}
      >
        Read More
      </Link>
    </div>
  );
};
