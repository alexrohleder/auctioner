import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import UserContext from "../../contexts/UserContext";
import useNow from "../../hooks/useNow";
import { post, useFetch } from "../../lib/web";

function NewAuction() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const user = useContext(UserContext);
  const now = useNow();
  const categories = useFetch("/api/v1/categories");

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
    const publicateAt = fields.publicate_at.value;

    setIsSaving(true);

    const { data, error } = await post("/api/v1/auctions", {
      sellerId: user!.id,
      categoryId: "24df7ada-1fa5-496e-92cf-8d906d93a034",
      title,
      description,
      bidIncrement,
      startingPrice,
      reservePrice,
      buyItNowPrice,
      duration,
      publicateAt,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Failed to create auction");
    } else {
      toast.success("Auction created");
      router.replace(`/auctions/${data.id}`);
    }
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
                    name="publicate_at"
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
                <Input label="Category" as="select" name="category" required>
                  {categories.data?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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