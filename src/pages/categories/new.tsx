import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { post } from "../../lib/web";

function NewCategory() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    setIsSaving(true);

    const { data, error } = await post("/api/v1/categories", {
      name: fields.name.value,
    });

    if (error) {
      setIsSaving(false);
      toast.error("Failed to create category");
    } else {
      toast.success("Category created");
      router.replace(`/categories/${data.id}`);
    }
  }

  return (
    <Layout title="New Category">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Category</div>
        </div>
      </div>
      <div className="flex-1 bg-gray-100">
        <div className="custom-container py-8">
          <form onSubmit={onSubmit}>
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
            </fieldset>

            <div className="flex items-center justify-end gap-4 mt-8">
              {isSaving && <Loading />}
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSaving}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default NewCategory;
