import { getAuthSession } from "@/lib/auth";
export default async function Dashboard() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <section className="w-full flex justify-center items-center h-screen">
        Not Authenticated
      </section>
    );
  }
  return (
    <section className="w-full flex justify-center items-center h-screen">
      Welcome back {session.user?.name}
    </section>
  );
}
