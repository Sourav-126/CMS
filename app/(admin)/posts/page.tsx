import { SessionUser } from "@/app/types";
import { AdminAllPosts } from "@/components/admin/AdminAllPosts";
import { UserAllPosts } from "@/components/admin/UserAllPosts";
import { authOptions } from "@/lib/auth";
import isAdmin from "@/utils/isAdmin";
import { getServerSession } from "next-auth";

export default async function AllPosts({ searchParams }) {
  const searchParam = await searchParams;
  const page = searchParam.page || 1;
  const category = searchParam.category || null;
  const session = await getServerSession(authOptions);

  const adminCheck = await isAdmin(session);
  if (!adminCheck) {
    return (
      <UserAllPosts
        page={page}
        category={category}
        userId={(session?.user as SessionUser).id}
      />
    );
  }

  return (
    <div>
      <AdminAllPosts page={page} category={category} />
    </div>
  );
}
