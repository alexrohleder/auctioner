import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import useAuction from "../../hooks/auctions/useAuction";
import useCloseAuction from "../../hooks/auctions/useCloseAuction";
import useReOpenAuction from "../../hooks/auctions/useReOpenAuction";
import useSettleAuction from "../../hooks/auctions/useSettleAuction";
import { AuctionUpdateSchema } from "../../schemas/AuctionSchema";
import * as z from "zod";
import { useEffect, useState } from "react";
import FormSubmitBar from "../../components/FormSubmitBar";
import { setValueAsOptionalNumber } from "../../lib/validation";
import { post } from "../../lib/web";
import { toast } from "react-toastify";

type Input = z.infer<typeof AuctionUpdateSchema>;

function Auction() {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;
  const auction = useAuction(auctionId);
  const { settle, canSettle } = useSettleAuction();
  const { close, canClose } = useCloseAuction();
  const { reOpen, canReOpen } = useReOpenAuction();
  const [isSubmitting, setSubmitting] = useState(false);
  const hasBids = auction.data ? auction.data.bids.length > 0 : false;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(AuctionUpdateSchema),
  });

  useEffect(() => {
    if (auction.data) {
      reset({
        title: auction.data.title,
        startingPrice: auction.data.startingPrice,
        bidIncrement: auction.data.bidIncrement,
        duration: auction.data.duration,
        reservePrice: auction.data.reservePrice || undefined,
        buyItNowPrice: auction.data.buyItNowPrice || undefined,
        description: auction.data.description || undefined,
      });
    }
  }, [auction.data]);

  const onSubmit: SubmitHandler<Input> = async (input) => {
    setSubmitting(true);

    const { error } = await post(`/api/v1/auctions/${auctionId}`, input);

    setSubmitting(false);

    if (error) {
      toast.error("Failed to update auction");
    } else {
      toast.success("Auction updated");
    }
  };

  return (
    <Layout title="Auction">
      <div className="custom-container py-8">
        <div className="flex gap-2 mb-8">
          <button
            className="btn"
            disabled={!canSettle(auction.data)}
            onClick={() => settle(auction.data!.id)}
          >
            Settle
          </button>
          <button
            className="btn"
            disabled={!canClose(auction.data)}
            onClick={() => close(auction.data!.id)}
          >
            Close
          </button>
          <button
            className="btn"
            disabled={!canReOpen(auction.data)}
            onClick={() => reOpen(auction.data!.id)}
          >
            Re Open
          </button>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 border-t">
        <form
          className="custom-container py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={!auction.data}>
            <fieldset>
              <legend className="font-semibold">General Information</legend>
              <div className="mt-2">
                <Input
                  label="Title"
                  type="text"
                  error={errors.title}
                  {...register("title")}
                  autoFocus
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Description"
                  type="textarea"
                  error={errors.description}
                  {...register("description")}
                  rows={3}
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
                    error={errors.startingPrice}
                    disabled={hasBids}
                    {...register("startingPrice", {
                      setValueAs: setValueAsOptionalNumber,
                    })}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Bid Increment"
                    prefix="$"
                    type="number"
                    error={errors.bidIncrement}
                    disabled={hasBids}
                    {...register("bidIncrement", {
                      setValueAs: setValueAsOptionalNumber,
                    })}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Reserve Price"
                    prefix="$"
                    type="number"
                    error={errors.reservePrice}
                    {...register("reservePrice", {
                      setValueAs: setValueAsOptionalNumber,
                    })}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Buy it Now Price"
                    prefix="$"
                    type="number"
                    step="0.01"
                    error={errors.buyItNowPrice}
                    {...register("buyItNowPrice", {
                      setValueAs: setValueAsOptionalNumber,
                    })}
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
                    type="select"
                    disabled={hasBids}
                    error={errors.duration}
                    {...register("duration", { valueAsNumber: true })}
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
                  type="select"
                  name="category"
                  required
                  disabled
                >
                  <option>{auction.data?.category?.name}</option>
                </Input>
              </div>
            </fieldset>

            {auction.data?.category?.attributes &&
              auction.data.category.attributes.length && (
                <fieldset className="mt-8">
                  <legend className="font-semibold">Category Attributes</legend>
                  <div className="lg:grid-cols-4 grid gap-4 mt-2">
                    {auction.data.category.attributes.map((attribute) => (
                      <Input
                        key={attribute.id}
                        label={attribute.name}
                        type="text"
                        id={attribute.id}
                        required={attribute.isRequired}
                        defaultValue={
                          auction.data?.category?.attributes.find(
                            (attr) => attr.id === attribute.id
                          )?.values[0].value || ""
                        }
                        disabled
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
          </fieldset>
          <div className="mt-8">
            <FormSubmitBar
              isValidating={auction.isValidating}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Auction;
