import { Session } from "@/app/types";

const listOfAdmins = [
  "test@gmail.com",
  "souravarora285@gmail.com",
  "tuntuna0978@gmail.com",
];

export default async function isAdmin(session: Session) {
  if (!session) {
    return false;
  }

  let emailMatch = listOfAdmins.map((each) =>
    each.toLowerCase().trim().includes(session.user.email.toLowerCase().trim())
  );

  if (session.user.role == "admin" || (session.user.email && emailMatch)) {
    return true;
  }
}
