import { getSingleUser } from "@/app/actions/getSingleUser";
import { DateFormat } from "@/utils/dateFormat";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleUser({ params }) {
  const { id } = await params;
  const user = await getSingleUser(id);
  if (!user) notFound();
  return (
    <>
      <UserProfile user={user} />
      <UserPosts posts={user.Post} />
    </>
  );
}

const UserProfile = ({ user }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <Image
        className="rounded-full border-2 border-[greenyellow]"
        src={user.image}
        width={80}
        height={80}
        alt={user.name}
      />
      <h1 className="text-xl font-bold">{user.name}</h1>
      <p className="text-gray-300">@{user.username}</p>
      <p className="text-gray-400 text-sm">
        Joined on: {DateFormat(user.createdAt)}
      </p>
    </div>
  );
};

const UserPosts = ({ posts }) => {
  return (
    <div className="flex flex-col gap-4 w-10/12 pt-10 mx-auto">
      <h3 className="text-xl font-bold ">User posts</h3>
      {posts.length === 0 ? (
        <p>No Posts found!</p>
      ) : (
        posts.map((post, index) => {
          return (
            <Link
              className="flex items-center gap-5 bg-zinc-800/40 hover:bg-zinc-800/20 transition-all duration-200 hover:scale-[1.03] rounded px-2 py-2 w-full mx-auto"
              href={`/blog/${post.slug}`}
            >
              <Image
                className="w-36 h-24 object-cover rounded-md"
                src={post.thumbnail || "/placeholder.jpg"}
                width={144}
                height={96}
                alt={post.title}
              />
              <div>
                <h3 className="text-gray-200 font-bold text-lg">
                  {post.title}
                </h3>
                <p className="text-gray-400">
                  {post.excerpt.substring(0, 30)}...
                </p>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};
