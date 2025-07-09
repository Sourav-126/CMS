import { SessionUser } from "@/app/types";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const {
    title,
    MetaDescription,
    category,
    content,
    excerpt,
    keywords,
    status,
    slug,
    thumbnail, // Changed from ogImage to thumbnail
  }: {
    title: string;
    thumbnail: string; // Changed from ogImage to thumbnail
    MetaDescription: string;
    category: string;
    content: string;
    excerpt: string;
    keywords: string;
    status: string;
    slug: string;
  } = body;

  console.log("Received thumbnail:", thumbnail); // Updated variable name

  if (
    !title ||
    !content ||
    !slug ||
    !category ||
    (!session.user as unknown as SessionUser).id
  ) {
    return NextResponse.json({ message: "Missing fields" }, { status: 401 });
  }

  const statusOfPost = status || "DRAFT";
  let categoryCheck = await prisma.category.findUnique({
    where: {
      slug: category,
    },
  });

  if (!categoryCheck) {
    categoryCheck = await prisma.category.create({
      data: {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
      },
    });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        thumbnail: thumbnail, // Use the thumbnail variable
        desc: MetaDescription,
        keywords: keywords,
        excerpt: excerpt,
        authorId: (session.user as SessionUser).id,
        catSlug: categoryCheck.slug,
        Status: statusOfPost as "DRAFT" | "PUBLISHED",
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not Save the Post" },
      { status: 500 }
    );
  }
}
