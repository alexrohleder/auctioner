import { AuctionStatuses } from ".prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../lib/web";
import { Auction } from "../../queries/Auction";

const useSettleAuction = () => {
  const [isSettling, setSettling] = useState(false);

  async function settle(auctionId: string) {
    setSettling(true);

    try {
      const { error } = await post(`/api/v1/auctions/${auctionId}/settle`);

      if (error) {
        toast.error("Failed to settle auction");
      } else {
        toast.success("Auction settled");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to settle auction");
    }

    setSettling(false);
  }

  function canSettle(auction?: Auction) {
    return (
      !isSettling &&
      auction?.currentStatus === AuctionStatuses.OPEN &&
      auction.bids.length > 0
    );
  }

  return {
    settle,
    isSettling,
    canSettle,
  };
};

export default useSettleAuction;
