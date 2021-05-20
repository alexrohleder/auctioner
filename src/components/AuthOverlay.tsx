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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
    <div className="flex items-center justify-center min-h-screen py-24">
      <form
        className="flex flex-col w-2/3 max-w-md gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-4xl font-semibold">Sign In</div>
        <div className="flex flex-col gap-2">
          <Input
            label="Email"
            type="text"
            {...register("email")}
            error={errors.email}
            disabled={isSubmitting}
            autoFocus
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            disabled={isSubmitting}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center justify-between">
          <a
            title="Functionality not available yet"
            className="text-blue-700 cursor-not-allowed"
          >
            Forgot password
          </a>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            Login
          </button>
        </div>
        <div className="pt-4 border-t">
          <a
            title="Functionality not available yet"
            className="text-blue-700 cursor-not-allowed"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </form>
    </div>
  );
}

export default AuthOverlay;
