import { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../lib/web";
import { AuctionResource } from "../../resources/AuctionResource";

const useCloseAuction = () => {
  const [isClosing, setClosing] = useState(false);

  async function close(auctionId: string) {
    setClosing(true);

    try {
      const { error } = await post(`/api/v1/auctions/${auctionId}/close`);

      if (error) {
        toast.error("Failed to close auction");
      } else {
        toast.success("Auction closed");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to close auction");
    }

    setClosing(false);
  }

  function canClose(auction?: AuctionResource) {
    return !isClosing && auction?.status === "OPEN";
  }

  return {
    close,
    isClosing,
    canClose,
  };
};

export default useCloseAuction;
