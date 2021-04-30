import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/dashboard");
    }
  }, [session, loading, router]);

  if (loading || session) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        Loading
      </div>
    );
  }

  return <div>login form</div>;
}
