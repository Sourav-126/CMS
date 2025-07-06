import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import isAdmin from "@/utils/isAdmin";
import { SessionUser } from "@/app/types";

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  if (!["DRAFT", "PUBLISHED", "ARCHIVED" < "DELETED"].includes(status)) {
    return NextResponse.json({ message: "Invalid Status" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const adminCheck = await isAdmin(session);

  const grabPost = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  const isAuthor = grabPost?.authorId === (session?.user as SessionUser).id;

  if (isAuthor || adminCheck) {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        Status: status,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  }
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
