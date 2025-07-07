import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma?.post.findUnique({
    where: {
      slug,
      Status: "PUBLISHED",
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

  if (!post) {
    return NextResponse.json(
      { message: "could not find the post" },
      { status: 404 }
    );
  }

  return NextResponse.json(post, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
