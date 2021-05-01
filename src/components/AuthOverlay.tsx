import { FormEvent, useState } from "react";
import supabase from "../lib/supabase";

function AuthOverlay() {
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function sign(op: "signUp" | "signIn") {
    setError(null);
    setAuthenticating(true);

    const { error } = await supabase.auth[op]({
      email,
      password,
    });

    if (error) {
      setError(error);
    }

    setAuthenticating(false);
  }

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    sign("signIn");
  }

  return (
    <div className="bg-gradient-to-t from-white to-transparent animate-fade-in fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center">
      <div className="p-6 bg-white border rounded">
        <form onSubmit={onSignIn}>
          <fieldset disabled={isAuthenticating}>
            <label className="block">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                name="email"
                className="block w-full mt-1 rounded"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus
              />
            </label>
            <label className="block mt-1">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                className="block w-full mt-1 rounded"
              />
            </label>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn"
                type="button"
                onClick={() => sign("signUp")}
              >
                Sign Up
              </button>
              <button className="btn btn--primary" type="submit">
                Login
              </button>
            </div>
          </fieldset>
          {error && <div>something went wrong</div>}
        </form>
      </div>
    </div>
  );
}

export default AuthOverlay;
