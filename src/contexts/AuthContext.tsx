import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import AuthOverlay from "../components/AuthOverlay";
import supabase from "../lib/supabase";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthContextProvider(props: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setUser(supabase.auth.user());
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "SIGNED_OUT":
            setUser(null);
            break;
          case "SIGNED_IN":
            setUser(supabase.auth.user());
            router.replace("/dashboard");
            break;
          case "USER_UPDATED":
            setUser(supabase.auth.user());
            break;
          default:
            break;
        }

        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        });
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {!isLoading && !user && router.pathname !== "/" && <AuthOverlay />}
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
