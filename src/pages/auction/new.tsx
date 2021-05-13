import { FormEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { post } from "../../lib/web";

function useNow() {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(new Date().toISOString().substr(0, "yyyy-mm-ddThh:mm".length));
  }, []);

  return now;
}

function NewAuction() {
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setValidity] = useState(false);
  const now = useNow();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements as any;
    const fields: Record<string, HTMLInputElement> = elements;

    const title = fields.title.value;
    const description = fields.description.value;
    const startingPrice = parseInt(fields.starting_price.value, 10);
    const bidIncrement = parseInt(fields.bid_increment.value, 10);
    const reservePrice = parseInt(fields.reserve_price.value, 10);
    const buyItNowPrice = parseInt(fields.buy_it_now_price.value, 10);
    const duration = parseInt(fields.duration.value, 10);
    const publicationDate = fields.publication_date.value;

    post("/api/v1/auctions", {
      sellerId: "f501c593-206a-4406-bb9e-8197c55b2f98",
      categoryId: "24df7ada-1fa5-496e-92cf-8d906d93a034",
      title,
      description,
      bidIncrement,
      startingPrice,
      reservePrice,
      buyItNowPrice,
      duration,
      isPublished: true,
    });

    setIsSaving(true);
  }

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
              <div className="mt-2">
                <Input
                  label="Title"
                  type="text"
                  name="title"
                  maxLength={80}
                  minLength={3}
                  required
                  autoFocus
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Description"
                  as="textarea"
                  name="description"
                  rows={3}
                  maxLength={2048}
                />
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-semibold">Settlement</legend>
              <div className="lg:grid-cols-4 grid gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    label="Starting Price"
                    prefix="$"
                    type="number"
                    name="starting_price"
                    defaultValue="10"
                    min={0}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Bid Increment"
                    prefix="$"
                    type="number"
                    name="bid_increment"
                    defaultValue="1"
                    min={1}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Reserve Price"
                    prefix="$"
                    type="number"
                    name="reserve_price"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Buy it Now Price"
                    prefix="$"
                    type="number"
                    name="buy_it_now_price"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-semibold">Visibility</legend>
              <div className="lg:grid-cols-4 grid gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    label="Duration"
                    as="select"
                    name="duration"
                    defaultValue={3}
                    required
                  >
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                    <option value={7}>7 days</option>
                    <option value={10}>10 days</option>
                  </Input>
                </div>
                <div className="flex-1">
                  <Input
                    label="Publication Date (UTC)"
                    type="datetime-local"
                    name="publication_date"
                    min={now}
                    defaultValue={now}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-semibold">Product Information</legend>
              <div className="lg:grid-cols-4 grid gap-4 mt-2">
                <Input
                  label="Category"
                  as="select"
                  name="category"
                  defaultValue="24df7ada-1fa5-496e-92cf-8d906d93a034"
                  required
                >
                  <option value="24df7ada-1fa5-496e-92cf-8d906d93a034">
                    Schedule
                  </option>
                </Input>
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

export default NewAuction;
