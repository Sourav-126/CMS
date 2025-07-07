import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminAllUsers() {
  const users = await fetchAllUsers();

  return (
    <section className="flex flex-col p-8 gap-4">
      {users.map((user, index) => {
        return (
          <Link
            href={`/users/${user.id}`}
            className="flex p-3 bg-gray-500/10  gap-3"
          >
            <Image
              className="size-20"
              src={user.image || ""}
              alt={user.name || "userImage"}
              height={50}
              width={50}
            />
            <div className="space-y-1">
              <h2 className="font-bold">{user.name}</h2>
              <p className=" text-gray-300">{user.email}</p>
              <p className="text-xs text-gray-300">{user.username}</p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

async function fetchAllUsers() {
  const res = await prisma.user.findMany({});
  return res;
}
