import { Feather } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthSession } from "@/lib/auth";
import { User } from "next-auth";
import Image from "next/image";
import SignOut from "./signOut";

export default async function Navbar() {
  const session = await getAuthSession();
  return (
    <div className="w-full flex justify-between items-center px-8 h-[12px]">
      <Link href={"/"} className="flex gap-2">
        <Feather />
        <span className="font-extrabold">Ink & Insights</span>
      </Link>
      {session ? (
        <UserModalComponent user={session?.user} />
      ) : (
        <Link href={"/sign-in"}>Sign in</Link>
      )}
    </div>
  );
}

const UserModalComponent = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Image
          className="rounded-full border-2 border-[greenyellow]"
          alt="userImage"
          src={user.image}
          width={30}
          height={30}
        />{" "}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/profile/${user.name}`}>Go to Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
