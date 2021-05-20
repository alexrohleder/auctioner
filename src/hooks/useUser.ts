import { UserRole } from ".prisma/client";
import { useSession } from "next-auth/client";

const useUser = () => {
  const [session] = useSession();

  const user = session!.user;
  const isOwner = user.role === UserRole.OWNER;
  const isAdmin = isOwner || user.role === UserRole.ADMIN;

  return {
    ...session!.user,

    isOwner,
    isAdmin,
  };
};

export default useUser;
