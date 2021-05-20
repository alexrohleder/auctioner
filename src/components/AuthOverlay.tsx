import { signIn } from "next-auth/client";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import * as z from "zod";
import { LoginSchema } from "../schemas/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCsrfToken from "../hooks/useCsrfToken";
import { useState } from "react";

type Input = z.infer<typeof LoginSchema>;

function AuthOverlay() {
  const csrfToken = useCsrfToken();
  const [isSubmitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<Input> = async (input) => {
    setSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      csrfToken,
      ...input,
    });

    if (response?.error || response?.url?.includes("error=")) {
      // todo: treat

      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-t from-white to-transparent fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="w-96 p-4 bg-white border rounded shadow-lg">
        <h1 className="mb-4 font-semibold">Authenticate</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting || !csrfToken}>
            <div className="mb-2">
              <Input label="Email" type="text" {...register("email")} />
            </div>
            <div className="mb-2">
              <Input label="Password" type="text" {...register("password")} />
            </div>
            <div className="mb-2">
              <Input label="Org" type="text" {...register("organizationId")} />
            </div>
            <button type="submit" className="btn btn--primary mt-2">
              Sign in with Email
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default AuthOverlay;
