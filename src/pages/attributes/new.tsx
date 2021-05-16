import { AttributeType } from ".prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { post } from "../../lib/web";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AttributeInsertSchema,
  ShouldHaveAtLeast2Options,
} from "../../schemas/AttributeSchema";
import * as z from "zod";
import FormSubmitBar from "../../components/FormSubmitBar";

type Input = z.infer<typeof AttributeInsertSchema>;

function NewAttribute() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    watch,
    control,
    trigger,
  } = useForm<Input>({
    resolver: zodResolver(AttributeInsertSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const hasLessThanRequiredOptions =
    (errors.options as any)?.message === ShouldHaveAtLeast2Options;

  const appendOption = () => {
    if (!getValues("options").find((option) => option.name === "")) {
      append({ name: "" });

      if (hasLessThanRequiredOptions) {
        clearErrors("options");
      }
    }
  };

  const type = watch("type");
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit: SubmitHandler<Input> = async (input) => {
    setIsSaving(true);

    const { data, error } = await post("/api/v1/attributes", input);

    setIsSaving(false);

    if (error) {
      toast.error("Failed to create attribute");
    } else {
      toast.success("Attribute created");
      router.replace(`/attributes/${data.id}`);
    }
  };

  return (
    <Layout title="New Attribute">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Attribute</div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container py-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className="font-semibold">General Information</legend>
              <div className="mt-2">
                <Input
                  {...register("name")}
                  label="Name"
                  type="text"
                  error={errors.name}
                  autoFocus
                />
              </div>
              <div className="mt-2">
                <Input {...register("slug")} label="Slug" type="text" />
              </div>
              <div className="mt-2">
                <Input
                  {...register("isRequired")}
                  label="Required"
                  type="checkbox"
                />
              </div>
              <div className="mt-2">
                <Input {...register("type")} label="Type" type="select">
                  {Object.values(AttributeType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Input>
              </div>
            </fieldset>
            {type === AttributeType.DROPDOWN && (
              <fieldset className="flex flex-col gap-2 p-4 mt-2 border rounded">
                <legend className="font-semibold">Dropdown Options</legend>
                {fields.map((option, optionIndex) => (
                  <div key={option.id} className="flex gap-2">
                    <Input
                      label=""
                      {...register(`options.${optionIndex}.name` as const)}
                      type="text"
                      error={errors?.options?.[optionIndex]?.name}
                      defaultValue={option.name}
                    />

                    <button
                      type="button"
                      className="btn mt-1"
                      onClick={() => {
                        remove(optionIndex);
                        trigger();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="mt-2">
                  <button type="button" className="btn" onClick={appendOption}>
                    Add question
                  </button>
                  {hasLessThanRequiredOptions && (
                    <p className="text-sm text-red-500">
                      {ShouldHaveAtLeast2Options}
                    </p>
                  )}
                </div>
              </fieldset>
            )}
            <div className="mt-8">
              <FormSubmitBar isSubmitting={isSaving} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
export default NewAttribute;
