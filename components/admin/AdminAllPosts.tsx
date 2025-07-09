import { getAllBlogs } from "@/app/actions/getAllBlogs";

import EditableBlogCards from "./EditableBlogCards";
import Pagination from "../pagination";
import { config } from "@/app/config/config";
import CategoryFilter from "../categoryFilter";
import { Post } from "@/app/types";
export const AdminAllPosts = async ({
  page,
  category,
}: {
  page: number;
  category: string;
}) => {
  const { posts, count } = await getAllBlogs({ page, category });
  if (!posts) {
    throw new Error("failed to get Posts");
  }

  const validPosts = posts.filter(
    (post) => post.Status === "DRAFT" || post.Status === "PUBLISHED"
  ) as Post[];
  return (
    <section className="p-8 flex flex-col gap-4">
      <h2>Manage all the Blogs</h2>
      <CategoryFilter />
      {validPosts.map((post) => {
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
