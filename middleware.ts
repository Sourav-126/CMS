import { NextResponse } from "next/server";
import { rateLimit } from "./utils/RateLimit";

export async function middleware(request: Request) {
  const allowedOrigins = ["http://localhost:3000", "https://mysite.com"];
  if (request.method == "POST") {
    const origin = request.headers.get("origin");
    if (!allowedOrigins.includes(origin || "")) {
      return NextResponse.json("CORS not allowed", { status: 403 });
    }
    let ip = request.headers.get("x-forwarded-for") || "unknown";
    const { remaining } = await rateLimit.limit(ip);
    if (!remaining) {
      return NextResponse.json(
        {
          message: "You have reached the Request limit",
        },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }
}

export const matcher = {
  matcher: "/api/v1/:path",
};
