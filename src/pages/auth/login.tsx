import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import supabase from "../../lib/supabase";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["sb:token"] as string;
  const { data: user } = await supabase.auth.api.getUser(token);

  let redirect;

  if (user) {
    redirect = {
      destination: "/dashboard",
    };
  }

  return {
    redirect,
    props: {},
  };
};

function Login() {
  const [error, setError] = useState<Error | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    const email = fields.email.value;
    const password = fields.password.value;

    setError(null);

    const { error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      setError(error);
    }
  }

  return (
    <form onSubmit={submit}>
      {error && <div>Something went wrong</div>}
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;
