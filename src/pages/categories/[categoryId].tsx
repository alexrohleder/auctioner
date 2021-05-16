import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import concat from "unique-concat";
import { FormEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import useAttributes from "../../hooks/attributes/useAttributes";
import useCategory from "../../hooks/categories/useCategory";
import { post } from "../../lib/web";
import FormSubmitBar from "../../components/FormSubmitBar";

function Category() {
  const { query } = useRouter();
  const category = useCategory(query.categoryId as string);
  const attributes = useAttributes();
  const [localAttrs, setLocalAttrs] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    const attrs = category.data?.attributes;

    if (attrs) {
      setLocalAttrs((c) => concat(c, attrs, (i) => i.id));
    }
  }, [category.data?.attributes]);

  function onAttachAttribute(event) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;
    const id = fields.attribute.value;

    setLocalAttrs((c) => concat(c, [{ id }], (i) => i.id));
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    setSubmitting(true);

    await post(`/api/v1/categories/${query.categoryId}`, {
      name: fields.name.value,
      attributes: localAttrs,
    });

    setSubmitting(false);
  }

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
      <div className="custom-container flex flex-col gap-8 py-8">
        <div className="lg:grid-cols-4 grid flex-1 gap-4">
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
              {category.data
                ? category.data.attributes.length
                : DataPlaceholder}
              {category.data && (
                <Link href="/attributes">
                  <a className="hover:underline text-sm text-blue-700">
                    See all
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button className="btn btn--primary" disabled={!category.data}>
              Delete Category
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 border-t">
        <div className="custom-container py-8">
          <fieldset className="flex flex-col gap-8" disabled={!category.data}>
            <form id="category-form" onSubmit={onSave}>
              <fieldset className="p-4 bg-white border rounded shadow">
                <legend className="font-semibold">General Information</legend>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  maxLength={80}
                  minLength={3}
                  defaultValue={category.data?.name}
                  required
                  autoFocus
                />
              </fieldset>
            </form>

            <fieldset className="p-4 bg-white border rounded shadow">
              <legend className="font-semibold">Attributes</legend>
              <form className="flex gap-4" onSubmit={onAttachAttribute}>
                <div className="flex-1">
                  <Input
                    label="Attribute"
                    name="attribute"
                    type="select"
                    required
                  >
                    {attributes.data?.map((attribute) => (
                      <option key={attribute.id} value={attribute.id}>
                        {attribute.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <button type="submit" className="btn mt-7">
                  Attach
                </button>
              </form>

              <pre>{JSON.stringify(localAttrs, null, 4)}</pre>
            </fieldset>
          </fieldset>
          <FormSubmitBar
            isValidating={category.isValidating}
            isSubmitting={isSubmitting}
            form="category-form"
          />
        </div>
      </div>
    </Layout>
  );
}

export default Category;
