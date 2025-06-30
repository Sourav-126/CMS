import { url } from "inspector";
import Image from "next/image";
import Link from "next/link";
// const BlogConfig = [
//   {
//     title: "ReactJS vs NextJS",
//     excerpt: "NEXT JS is the ultimate development framework ....",
//     location: "/photo1.png",
//     url: "/demo-slug",
//   },
//   {
//     title: "SSR vs SEO",
//     excerpt: "Need to think about that",
//     location: "/photo2.png",
//     url: "/demo-slug",
//   },
//   {
//     title: "How to Become a Good Backend Dev",
//     excerpt: "Make your Logic thinking and Problem solving Hard and fast ",
//     location: "/photo1.png",
//     url: "/demo-slug",
//   },
// ];

export default function Blogs() {
  return (
    <section className="grid grid-cols-3  gap-4 md:grid-cols-5 p-8">
      {BlogConfig.map(({ title, excrept, location, url }, index) => {
        return (
          <BlogCard
            key={index}
            title={title}
            image={location}
            excerpt={excrept}
            url={url}
          />
        );
      })}
    </section>
  );
}

const BlogCard = ({
  title,
  excerpt,
  image,
  url,
}: {
  title: string;
  excerpt: string;
  image: string;
  url: string;
}) => {
  return (
    <div className="bg-gray-600/20 rounded-lg border  flex flex-col p-1 gap-1 hover:scale-103 transition duration-300 delay-100">
      <Image
        className="object-cover w-full rounded-md "
        src={image}
        height={150}
        width={300}
        alt={title}
      />
      <h2 className="text-xl font-bold text-gray-200">{title}</h2>
      <p className="text-sm  text-gray-400"> {excerpt}</p>
      <Link
        className="bg-zinc-600/70 py-2 px-3 rounded w-fit text-xsm"
        href={`blog/${url}`}
      >
        Read More
      </Link>
    </div>
  );
};
