import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      {
        message: "Query is blank",
      },
      { status: 404 }
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      Status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  if (!posts.length) {
    return NextResponse.json(
      { message: "No posts with current query found" },
      { status: 404 }
    );
  }

  return NextResponse.json(posts, { status: 200 });
}

// /api/v1/search?query=blog
