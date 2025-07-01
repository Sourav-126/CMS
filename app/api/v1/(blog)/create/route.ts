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
    excerpts,
    keywords,
    status,
    slug,
    ogImage,
  }: {
    title: string;
    ogImage: string;
    MetaDescription: string;
    category: string;
    content: string;
    excerpts: string;
    keywords: string;
    status: string;
    slug: string;
  } = body;

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
        thumbnail: ogImage || null,
        desc: MetaDescription,
        keywords: keywords || null,
        excerpt: excerpts || null,
        authorId: (session.user as SessionUser).id,
        catSlug: categoryCheck.slug,
        Status: statusOfPost,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Could not Save the Post" },
      { status: 500 }
    );
  }
}
