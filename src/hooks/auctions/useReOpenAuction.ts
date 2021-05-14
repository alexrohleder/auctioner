import { AuctionStatuses } from ".prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../lib/web";
import { AuctionResource } from "../../resources/AuctionResource";

const useReOpenAuction = () => {
  const [isReOpening, setReOpening] = useState(false);

  async function reOpen(auctionId: string) {
    setReOpening(true);

    try {
      const { error } = await post(`/api/v1/auctions/${auctionId}/re-open`);

      if (error) {
        toast.error("Failed to re-open auction");
      } else {
        toast.success("Auction closed");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to re-open auction");
    }

    setReOpening(false);
  }

  function canReOpen(auction?: AuctionResource) {
    return !isReOpening && auction?.status === AuctionStatuses.CLOSED;
  }

  return {
    reOpen,
    isReOpening,
    canReOpen,
  };
};

export default useReOpenAuction;
