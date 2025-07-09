import EditableBlogCards from "./EditableBlogCards";
import Pagination from "../pagination";
import { config } from "@/app/config/config";
import CategoryFilter from "../categoryFilter";
import { Post } from "@/app/types";
import { getUserBlogs } from "@/app/actions/getAllBlogs";

interface UserAllPostsProps {
  page: number;
  category: string;
  userId: string;
}

export const UserAllPosts = async ({
  page,
  category,
  userId,
}: UserAllPostsProps) => {
  const result = await getUserBlogs({ page, category, userId });
  const { posts, count } = result ?? { posts: [], count: 0 };

  const validPosts = posts.filter(
    (post) => post.Status === "DRAFT" || post.Status === "PUBLISHED"
  ) as Post[];

  if (validPosts.length > 0) {
    return (
      <section className="p-8 flex flex-col gap-4">
        <h2>Manage all the Blogs</h2>
        <CategoryFilter />
        {validPosts.map((post: Post) => {
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
  }
};
