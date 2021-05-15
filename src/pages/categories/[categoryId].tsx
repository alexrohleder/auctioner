import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import concat from "unique-concat";
import { FormEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import useAttributes from "../../hooks/attributes/useAttributes";
import useCategory from "../../hooks/categories/useCategory";
import { post } from "../../lib/web";

function Category() {
  const { query } = useRouter();
  const category = useCategory(query.categoryId as string);
  const attributes = useAttributes();
  const [localAttrs, setLocalAttrs] = useState([]);

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

    await post(`/api/v1/categories/${query.categoryId}`, {
      name: fields.name.value,
      attributes: localAttrs,
    });
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
        <fieldset className="flex flex-col gap-8" disabled={!category.data}>
          <form id="category-form" onSubmit={onSave}>
            <fieldset>
              <legend className="font-semibold">General Information</legend>
              <div className="mt-2">
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
              </div>
            </fieldset>
          </form>

          <fieldset>
            <legend className="font-semibold">Attributes</legend>
            <form
              className="flex gap-2 p-4 mt-2 border rounded"
              onSubmit={onAttachAttribute}
            >
              <Input label="Attribute" name="attribute" as="select" required>
                {attributes.data?.map((attribute) => (
                  <option key={attribute.id} value={attribute.id}>
                    {attribute.name}
                  </option>
                ))}
              </Input>
              <button type="submit" className="btn mt-7">
                Attach
              </button>
            </form>
            <pre>{JSON.stringify(localAttrs, null, 4)}</pre>
            <p className="mt-2">No attributes yet.</p>
          </fieldset>
        </fieldset>
        {category.isValidating && (
          <div className="flex justify-center mt-16">
            <Loading />
          </div>
        )}
        <div className="flex items-center justify-end gap-4 mt-8">
          <button
            type="submit"
            className="btn btn--primary"
            form="category-form"
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Category;
