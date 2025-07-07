import { prisma } from "@/lib/prisma";

async function fetchSingleUser(id: string) {
  const res = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      image: true,
      createdAt: true,
      username: true,
      Post: {
        select: {
          title: true,
          excerpt: true,
          thumbnail: true,
          slug: true,
        },
      },
    },
  });

  return res;
}

export async function getSingleUser(id: string) {
  const user = await fetchSingleUser(id);
  if (!user) {
    return {
      error: "User Not found",
    };
  }
  return user;
}
