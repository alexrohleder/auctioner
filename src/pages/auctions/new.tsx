import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import UserContext from "../../contexts/UserContext";
import useCategories from "../../hooks/categories/useCategories";
import { post } from "../../lib/web";

function NewAuction() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const user = useContext(UserContext);
  const categories = useCategories();
  const [categoryId, setCategoryId] = useState<string>();
  const [attributes, setAttributes] = useState({});

  const category = categoryId
    ? categories?.data?.find((category) => category.id === categoryId)
    : null;

  useEffect(() => {
    setCategoryId((category) => {
      if (category === undefined) {
        return categories.data?.[0].id;
      }
    });
  }, [categories.data]);

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

    setIsSaving(true);

    const { data, error } = await post("/api/v1/auctions", {
      sellerId: user!.id,
      categoryId,
      title,
      description,
      bidIncrement,
      startingPrice,
      reservePrice,
      buyItNowPrice,
      duration,
      attributes: Object.values(attributes),
    });

    setIsSaving(false);

    if (error) {
      toast.error("Failed to create auction");
    } else {
      toast.success("Auction created");
      router.replace(`/auctions/${data.id}`);
    }
  }

  function onChangeAttribute(event: ChangeEvent<HTMLInputElement>) {
    setAttributes((attributes) => ({
      ...attributes,
      [event.target.id]: {
        attributeId: event.target.id,
        value: event.target.value,
      },
    }));
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
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-semibold">Product Information</legend>
              <div className="lg:grid-cols-4 grid gap-4 mt-2">
                <Input
                  label="Category"
                  as="select"
                  name="category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                >
                  {categories.data?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </div>
            </fieldset>

            {category?.attributes.length && (
              <fieldset className="mt-8">
                <legend className="font-semibold">Category Attributes</legend>
                <div className="lg:grid-cols-4 grid gap-4 mt-2">
                  {category.attributes.map((attribute) => (
                    <Input
                      key={attribute.id}
                      label={attribute.name}
                      as={attribute.type === "DROPDOWN" ? "select" : "input"}
                      type="text"
                      id={attribute.id}
                      required={attribute.isRequired}
                      value={attributes[attribute.id]?.value}
                      onChange={onChangeAttribute}
                    >
                      {attribute.options.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </Input>
                  ))}
                </div>
              </fieldset>
            )}

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
