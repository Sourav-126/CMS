import { getAllBlogs, getUserBlogs } from "@/app/actions/getAllBlogs";

import SingleBlog from "@/app/blog/[slug]/page";
import EditableBlogCards from "./EditableBlogCards";
import Pagination from "../pagination";
import { config } from "@/app/config/config";
import CategoryFilter from "../categoryFilter";
export const UserAllPosts = async ({
  page,
  category,
  userId,
}: {
  page: number;
  category: string;
  userId: string;
}) => {
  const { posts, count } = await getUserBlogs({ page, category, userId });
  if (!posts) {
    throw new Error("failed to get Posts");
  }
  return (
    <section className="p-8 flex flex-col gap-4">
      <h2>Manage all the Blogs</h2>
      <CategoryFilter />
      {posts.map((post) => {
        return <EditableBlogCards key={post.id} post={post} />;
      })}

      <Pagination
        currentPage={page}
        totalItems={count}
        perPage={config.POSTS_PER_PAGE}
        className="fixed bottom-10 left-1/2 -translate-x-1/2"
      />
    </section>
  );
};
