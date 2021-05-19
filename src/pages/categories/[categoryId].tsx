import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import useAttributes from "../../hooks/attributes/useAttributes";
import useCategory from "../../hooks/categories/useCategory";
import { post } from "../../lib/web";
import FormSubmitBar from "../../components/FormSubmitBar";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryUpdateSchema } from "../../schemas/CategorySchema";
import * as z from "zod";
import { toast } from "react-toastify";
import useDeleteCategory from "../../hooks/categories/useDeleteCategory";

type Input = z.infer<typeof CategoryUpdateSchema>;

function Category() {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  const category = useCategory(categoryId);
  const didReset = useRef(false);
  const attributes = useAttributes();
  const attrInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [deleteCategory, isDeleting] = useDeleteCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: { name: "", attributes: [] } as Input,
    resolver: zodResolver(CategoryUpdateSchema),
  });

  const { fields: attrs, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  useEffect(() => {
    if (category.data && !didReset.current) {
      reset({
        name: category.data.name,
        attributes: category.data.attributes,
      });

      didReset.current = true;
    }
  }, [category.data]);

  const unselectedAttrs = attributes.data
    ? attributes.data.filter(({ id }) => !attrs.find((a) => a.id === id))
    : [];

  const onSubmit: SubmitHandler<Input> = async (input) => {
    setSubmitting(true);

    const { error } = await post(`/api/v1/categories/${categoryId}`, input);

    setSubmitting(false);

    if (error) {
      toast.error("Failed to update category");
    } else {
      toast.success("Category updated");
    }
  };

  const onDelete = async () => {
    const { error } = await deleteCategory(categoryId);

    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      router.replace("/categories");
    }
  };

  const onAttachAttribute = () => {
    if (attrInputRef.current?.value) {
      append({
        id: attrInputRef.current.value,
      });
    }
  };

  if (category.error) {
    return (
      <Layout title="Category">
        <div className="mt-8 text-center">
          Unable to fetch the requested category
        </div>
      </Layout>
    );
  }

  const title = category.data ? `${category.data.name} - Category` : "Category";
  const DataPlaceholder = <div className="placeholder w-24 h-4" />;

  return (
    <Layout title={title}>
      <div className="custom-container lg:grid-cols-4 grid gap-4 py-8">
        <div className="p-4 border rounded">
          <div className="font-semibold">Created at</div>
          <div className="flex items-center h-8 text-lg">
            {category.data
              ? format(new Date(category.data.createdAt), "dd MMM yyyy hh:ss")
              : DataPlaceholder}
          </div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Amount of Auctions</div>
          <div className="flex items-center justify-between h-8 text-lg">
            {category.data ? category.data.auctions.length : DataPlaceholder}
            {category.data && (
              <a className="hover:underline text-sm text-blue-700">See all</a>
            )}
          </div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Amount of Attributes</div>
          <div className="flex items-center justify-between h-8 text-lg">
            {category.data ? category.data.attributes.length : DataPlaceholder}
            {category.data && (
              <Link href="/attributes">
                <a className="hover:underline text-sm text-blue-700">See all</a>
              </Link>
            )}
          </div>
        </div>
        <div />
      </div>
      <div className="flex-1 bg-gray-100 border-t">
        <div className="custom-container py-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col gap-8" disabled={!category.data}>
              <fieldset>
                <legend className="font-semibold">General Information</legend>
                <Input
                  label="Name"
                  type="text"
                  {...register("name")}
                  error={errors.name}
                  autoFocus
                />
              </fieldset>
              <fieldset>
                <legend className="font-semibold">Attributes</legend>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      label="Attribute"
                      type="select"
                      ref={attrInputRef}
                      disabled={unselectedAttrs.length === 0}
                    >
                      {unselectedAttrs.map((attribute) => (
                        <option key={attribute.id} value={attribute.id}>
                          {attribute.name}
                        </option>
                      ))}
                    </Input>
                  </div>
                  <button
                    type="button"
                    className="btn mt-7"
                    onClick={onAttachAttribute}
                    disabled={unselectedAttrs.length === 0}
                  >
                    Attach
                  </button>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  {attrs.map(({ id }, index) => {
                    const attribute = attributes.data?.find(
                      (attr) => attr.id === id
                    );

                    if (attribute) {
                      return (
                        <div
                          key={id}
                          className="hover:bg-white bg-gray-50 flex items-center justify-between px-4 py-2 border rounded"
                        >
                          {attribute.name}
                          <button
                            type="button"
                            className="btn btn--link btn--sm"
                            onClick={() => remove(index)}
                          >
                            remove
                          </button>
                        </div>
                      );
                    }
                  })}
                  {attrs.length === 0 && (
                    <div className="text-center">
                      <p>No attributes attached yet.</p>
                    </div>
                  )}
                </div>
              </fieldset>
              <FormSubmitBar
                isValidating={category.isValidating}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                onDelete={onDelete}
              />
            </fieldset>
          </form>
        </div>
      </div>
    </Layout>
  );
}
export default Category;
