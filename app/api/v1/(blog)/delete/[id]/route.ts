import { Session, SessionUser } from "@/app/types";
import { authOptions } from "@/lib/auth";
import isAdmin from "@/utils/isAdmin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const adminCheck = await isAdmin(session as unknown as Session);

  if (!session?.user && !adminCheck) {
    return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
  }

  const grabPost = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!grabPost) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const isAuthor = (session?.user as SessionUser).id === id;

  if (isAuthor || adminCheck) {
    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedPost, { status: 200 });
  }
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
