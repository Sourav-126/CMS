import { Session } from "@/app/types";
import AdminAllUsers from "@/components/admin/AdminAllUsers";
import { authOptions } from "@/lib/auth";
import isAdmin from "@/utils/isAdmin";
import { getServerSession } from "next-auth";

export default async function AllUsersPage() {
  const session = await getServerSession(authOptions);
  const adminCheck = await isAdmin(session as unknown as Session);

  if (!adminCheck && !session?.user) {
    return (
      <div className="w-full h-screen justify-center items-center">
        You are not A valid User to see this Shit
      </div>
    );
  }
  return (
    <div>
      return <AdminAllUsers />
    </div>
  );
}
