import { AttributeType } from ".prisma/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { post } from "../../lib/web";

function NewAttribute() {
  const router = useRouter();
  const [type, setType] = useState<AttributeType>("TEXT");
  const [isCreatingOption, setCreatingOption] = useState(false);
  const [options, setOptions] = useState<{ name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    setIsSaving(true);

    const { data, error } = await post("/api/v1/attributes", {
      name: fields.name.value,
      slug: fields.slug.value,
      type: fields.type.value,
      options: type === "DROPDOWN" ? options : undefined,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Failed to create attribute");
    } else {
      toast.success("Attribute created");
      router.replace(`/categories/${data.id}`);
    }
  }

  function onAddDropdownOption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    console.log("asd");

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    setOptions([...options, { name: fields.name.value as string }]);
  }

  return (
    <Layout title="New Attribute">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Attribute</div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container py-8">
          <form id="attribute-form" onSubmit={onSubmit}>
            <fieldset>
              <legend className="font-semibold">General Information</legend>
              <div className="mt-2">
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  maxLength={80}
                  minLength={3}
                  required
                  autoFocus
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Slug"
                  type="text"
                  name="slug"
                  maxLength={24}
                  minLength={2}
                  required
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Type"
                  type="text"
                  as="select"
                  name="type"
                  value={type}
                  onChange={(e) => setType(AttributeType[e.target.value])}
                  required
                >
                  {Object.values(AttributeType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Input>
              </div>
            </fieldset>
          </form>
          {type === AttributeType.DROPDOWN && (
            <fieldset className="flex flex-col gap-2 p-4 mt-2 border rounded">
              <legend className="font-semibold">Dropdown Options</legend>
              <form
                className="lg:w-64 flex justify-between gap-2"
                onSubmit={onAddDropdownOption}
              >
                <div className="flex-1">
                  <Input label="Option" type="text" name="name" required />
                </div>
                <div className="mt-7">
                  <button type="submit" className="btn">
                    Add
                  </button>
                </div>
              </form>
              {options.map((option) => (
                <div
                  key={option.name}
                  className="flex items-center justify-between px-4 py-1 bg-white border rounded"
                >
                  {option.name}
                  <button className="hover:underline text-blue-700">
                    Remove
                  </button>
                </div>
              ))}
            </fieldset>
          )}

          <div className="flex items-center justify-end gap-4 mt-8">
            {isSaving && <Loading />}
            <button
              type="submit"
              className="btn btn--primary"
              form="attribute-form"
              disabled={isSaving}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NewAttribute;
