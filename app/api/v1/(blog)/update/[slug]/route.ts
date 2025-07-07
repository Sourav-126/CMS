import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Session, SessionUser } from "@/app/types";
import { revalidateTag } from "next/cache";
import isAdmin from "@/utils/isAdmin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const {
      title,
      ogImage,
      content,
      excerpt,
      status,
      MetaDescription,
      keywords,
    } = body;

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const Admin = await isAdmin(session as unknown as Session);

    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      console.log("Post not found for slug:", slug);
      return NextResponse.json({ message: "No Post found" }, { status: 404 });
    }

    const isAuthor = post.authorId === (session?.user as SessionUser).id;

    if (!isAuthor && !Admin) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
        thumbnail: ogImage || null,
        desc: MetaDescription,
        keywords: keywords || null,
        excerpt: excerpt || null,
        Status: status,
      },
    });

    revalidateTag(slug);

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        message: "Failed to update Post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("GET request for slug:", slug);

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const admin = await isAdmin(session as unknown as Session);

    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!post) {
      console.log("Post not found for slug:", slug);
      return NextResponse.json({ message: "Post not Found" }, { status: 404 });
    }

    const isAuthor = (session?.user as SessionUser).id === post.authorId;

    if (!isAuthor && !admin) {
      return NextResponse.json(
        { message: "You are not allowed to change the post" },
        { status: 403 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch Post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
