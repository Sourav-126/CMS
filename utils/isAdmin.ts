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
  let userEmail = session.user.email.toLowerCase().trim();

  let emailMatch = listOfAdmins.some(
    (singleEmail) => singleEmail.toLowerCase().trim() === userEmail
  );

  if (session.user.role == "admin" || (session.user.email && emailMatch)) {
    return true;
  }
}
