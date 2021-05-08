import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { post } from "../../lib/web";

function CreateAuction() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const user = { id: "ba22dcb8-59f6-4466-ae55-82f88607af70" };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    const title = fields.title.value;
    const description = fields.description.value;
    const startingPrice = parseInt(fields.starting_price.value, 10);
    const bidIncrement = parseInt(fields.bid_increment.value, 10);
    const isPublished = fields.is_published.value === "1";

    // todo: further validate fields

    setIsSaving(true);

    const { data, error } = await post("/api/auction", {
      sellerId: user.id,
      bidIncrement,
      startingPrice,
      currencyCode: "NOK",
      title,
      description,
      isPublished,
      //images: uploadedFiles,
    });

    setIsSaving(false);

    if (error) {
      // todo: show toast with error message
    } else if (data?.length) {
      router.push(`/auction/${data[0].id}`);
      // todo: show toast with succesful message
    }
  }

  // todo: treat errors
  async function onImageUpload(event: ChangeEvent<HTMLInputElement>) {}

  return (
    <Layout title="New Auction">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Auction</div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container py-8">
          <form onSubmit={onSubmit}>
            <fieldset>
              <legend className="font-semibold">General Information</legend>
              <label className="block mt-2">
                <span className="text-gray-700">Title</span>
                <input
                  type="text"
                  name="title"
                  className="block w-full mt-1 rounded"
                  maxLength={120}
                  minLength={3}
                  required
                  autoFocus
                />
              </label>
              <label className="block mt-2">
                <span className="text-gray-700">Description</span>
                <textarea
                  className="block w-full mt-1 rounded"
                  rows={3}
                  name="description"
                />
              </label>
            </fieldset>

            <fieldset className="flex w-full gap-4 mt-8">
              <legend className="font-semibold">Settlement</legend>
              <label className="flex-1 mt-2">
                <span className="text-gray-700">Starting Price</span>
                <input
                  type="number"
                  name="starting_price"
                  className="block w-full mt-1 rounded"
                  defaultValue="0"
                  min={0}
                />
              </label>
              <label className="flex-1 mt-2">
                <span className="text-gray-700">Bid Increment</span>
                <input
                  type="number"
                  name="bid_increment"
                  className="block w-full mt-1 rounded"
                  defaultValue="0"
                  min={0}
                />
              </label>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-semibold">Visibility</legend>
              <label className="block mt-2">
                <input
                  type="radio"
                  name="is_published"
                  value="1"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Published</span>
              </label>
              <label className="block">
                <input type="radio" name="is_published" value="0" />
                <span className="ml-2 text-gray-700">Not published</span>
              </label>
            </fieldset>

            <div className="mt-8">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                className=""
                onChange={onImageUpload}
                multiple
              />
            </div>

            <div className="flex items-center justify-end gap-4 mt-8">
              {isSaving && <Loading />}
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSaving}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAuction;
