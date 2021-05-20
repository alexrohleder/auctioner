import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import AuthenticationOverlay from "./AuthOverlay";
import Loading from "./Loading";

type Props = {
  children: ReactNode;
};

const openRoutes = ["/"];

function AuthGuard(props: Props) {
  const [session, isLoading] = useSession();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading label="Fetching user data..." />
      </div>
    );
  }

  const needsToAuthenticate = !session && !openRoutes.includes(router.route);

  return needsToAuthenticate ? <AuthenticationOverlay /> : props.children;
}

export default AuthGuard;
