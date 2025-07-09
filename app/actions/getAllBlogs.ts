import { prisma } from "@/lib/prisma";
import { config } from "@/app/config/config";

export async function getAllBlogs({
  page,
  category,
}: {
  page: number;
  category?: string;
}) {
  const postsToShow = config.POSTS_PER_PAGE;

  // Ensure page is a valid number and at least 1
  const validPage = Math.max(1, Number(page) || 1);
  const skipAmount = postsToShow * (validPage - 1);

  const query = {
    take: postsToShow,
    skip: skipAmount,
    where: {
      ...(category && {
        catSlug: {
          equals: category,
          mode: "insensitive" as const,
        },
      }),
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  };

  const [posts, count] = await prisma.$transaction([
    prisma.post.findMany(query),
    prisma.post.count({
      where: {
        ...(category && { catSlug: category }),
      },
    }),
  ]);

  return { posts, count };
}

export async function getUserBlogs({
  page,
  category,
  userId,
}: {
  page: number;
  category?: string;
  userId: string;
}) {
  const postsToShow = config.POSTS_PER_PAGE;

  // Ensure page is a valid number and at least 1
  const validPage = Math.max(1, Number(page) || 1);
  const skipAmount = postsToShow * (validPage - 1);

  const queryBase = {
    authorId: userId,
    ...(category && {
      catSlug: {
        equals: category,
        mode: "insensitive" as const,
      },
    }),
  };

  const query = {
    take: postsToShow,
    skip: skipAmount,
    where: queryBase,
    orderBy: {
      createdAt: "desc" as const,
    },
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({
        where: queryBase,
      }),
    ]);
    return { posts, count };
  } catch {
    console.log("can't fetch post");
  }
}
