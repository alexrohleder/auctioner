import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import supabase from "../../lib/supabase";

function CreateAuction() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    const title = fields.title.value;
    const description = fields.description.value;
    const starting_price = parseInt(fields.starting_price.value, 10);
    const bid_increment = parseInt(fields.bid_increment.value, 10);
    const is_published = fields.is_published.checked;

    // todo: further validate fields

    setIsSaving(true);

    const { data, error } = await supabase.from("auctions").insert({
      seller_id: "9e7f26e6-e5f9-400a-a021-63ac3493f255", // todo: use authenticated user
      title,
      description,
      starting_price,
      bid_increment,
      currency_code: "nok",
      is_published,
      images: uploadedFiles,
    });

    setIsSaving(false);

    if (error) {
      // todo: show toast with error message
    } else if (data?.length) {
      router.push(`/auctions/${data[0].id}`);
      // todo: show toast with succesful message
    }
  }

  // todo: treat errors
  async function onImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const uploads = await Promise.all(
      Array.from(event.target.files).map((file) =>
        supabase.storage
          .from("auction-images")
          .upload(`${uuidv4()}.${file.type.substr("image/".length)}`, file)
      )
    );

    setUploadedFiles(uploads.map((upload) => upload.data.Key));
  }

  return (
    <Layout title="New Auction">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Auction</div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container">
          <form onSubmit={onSubmit}>
            <fieldset>
              <legend>General Information</legend>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                maxLength={120}
                minLength={3}
                required
              />
              <label htmlFor="description">Description</label>
              <textarea rows={3} id="description" name="description" />
            </fieldset>
            <fieldset>
              <legend>Settlement</legend>
              <label htmlFor="starting_price">Starting Price</label>
              <input
                type="number"
                id="starting_price"
                name="starting_price"
                defaultValue="0"
                min={0}
              />
              <label htmlFor="bid_increment">Bid Increment</label>
              <input
                type="number"
                id="bid_increment"
                name="bid_increment"
                defaultValue="0"
                min={0}
              />
            </fieldset>
            <fieldset>
              <legend>Visibility</legend>
              <label htmlFor="is_published">Publish</label>
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                defaultChecked
              />
            </fieldset>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              onChange={onImageUpload}
              multiple
              required
            />
            <Button type="submit" isPrimary isLoading={isSaving}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAuction;
