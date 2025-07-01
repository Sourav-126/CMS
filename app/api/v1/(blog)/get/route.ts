import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma?.post.findMany({
    where: {
      Status: "PUBLISHED",
    },
  });
  return NextResponse.json(posts);
}
