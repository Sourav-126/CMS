import { Session, SessionUser } from "@/app/types";
import { AdminAllPosts } from "@/components/admin/AdminAllPosts";
import { UserAllPosts } from "@/components/admin/UserAllPosts";
import { authOptions } from "@/lib/auth";
import isAdmin from "@/utils/isAdmin";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AllPosts({
  searchParams,
}: {
  searchParams: Promise<{ page: number; category: string | null }>;
}) {
  const searchParam = await searchParams;
  const page = searchParam.page || 1;
  const category = searchParam.category || null;
  const session = await getServerSession(authOptions);

  const adminCheck = await isAdmin(session as unknown as Session);
  if (!adminCheck) {
    try {
      return (
        <UserAllPosts
          page={page}
          category={category as string}
          userId={(session?.user as SessionUser).id}
        />
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      return (
        <div className="flex flex-col  justify-center items-center h-screen text-white">
          <div className="text-center text-2xl font-semibold ">
            Not Authorized!
          </div>
          <p>
            Make a account now!
            <Link className="text-blue-300 underline" href={"/sign-up"}>
              SignUp
            </Link>
          </p>
        </div>
      );
    }
  }

  return (
    <div>
      <AdminAllPosts page={page} category={category as string} />
    </div>
  );
}
