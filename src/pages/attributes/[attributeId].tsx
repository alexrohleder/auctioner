import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSubmitBar from "../../components/FormSubmitBar";
import Layout from "../../components/Layout";
import useAttribute from "../../hooks/attributes/useAttribute";
import useDeleteAttribute from "../../hooks/attributes/useDeleteAttribute";
import { AttributeUpdateSchema } from "../../schemas/AttributeSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/Input";
import { post } from "../../lib/web";
import { toast } from "react-toastify";

type Input = z.infer<typeof AttributeUpdateSchema>;

function Attribute() {
  const router = useRouter();
  const attributeId = router.query.attributeId as string;
  const attribute = useAttribute(attributeId);
  const [deleteAttribute, isDeleting] = useDeleteAttribute();
  const [isSubmitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<Input>({
    resolver: zodResolver(AttributeUpdateSchema),
  });

  useEffect(() => {
    if (attribute.data) {
      reset({
        name: attribute.data.name,
        isRequired: attribute.data.isRequired,
      });
    }
  }, [attribute.data]);

  const onSubmit: SubmitHandler<Input> = async (input) => {
    setSubmitting(true);

    const { error } = await post(`/api/v1/attributes/${attributeId}`, input);

    setSubmitting(false);

    if (error) {
      toast.error("Failed to update attribute");
    } else {
      toast.success("Attribute updated");
    }
  };

  const onDelete = async () => {
    const { error } = await deleteAttribute(attributeId);

    if (error) {
      toast.error("Failed to delete attribute");
    } else {
      toast.success("Attribute deleted");
      router.replace("/attributes");
    }
  };

  if (attribute.error) {
    return (
      <Layout title="Attribute">
        <div className="mt-8 text-center">
          Unable to fetch the requested attribute
        </div>
      </Layout>
    );
  }

  const DataPlaceholder = <div className="placeholder w-24 h-4" />;

  return (
    <Layout title="Attribute">
      <div className="custom-container lg:grid-cols-4 grid gap-4 py-8">
        <div className="p-4 border rounded">
          <div className="font-semibold">Created at</div>
          <div className="flex items-center h-8 text-lg">
            {attribute.data
              ? format(new Date(attribute.data.createdAt), "dd MMM yyyy hh:ss")
              : DataPlaceholder}
          </div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Last updated at</div>
          <div className="flex items-center h-8 text-lg">
            {attribute.data
              ? format(new Date(attribute.data.updatedAt), "dd MMM yyyy hh:ss")
              : DataPlaceholder}
          </div>
        </div>
        <div />
        <div />
      </div>
      <div className="flex-1 bg-gray-100 border-t">
        <form
          className="custom-container py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={!attribute.data}>
            <legend className="font-semibold">General Information</legend>
            <div className="mt-2">
              <Input label="Name" type="text" {...register("name")} autoFocus />
            </div>
            <div className="mt-2">
              <Input
                label="Slug"
                type="text"
                defaultValue={attribute.data?.slug}
                disabled
              />
            </div>
            <div className="mt-2">
              <Input
                label="Required"
                type="checkbox"
                {...register("isRequired")}
              />
            </div>
            <div className="mt-2">
              <Input label="Type" type="select" disabled>
                <option>{attribute.data?.type}</option>
              </Input>
            </div>
          </fieldset>
          <div className="mt-8">
            <FormSubmitBar
              isValidating={attribute.isValidating}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Attribute;
