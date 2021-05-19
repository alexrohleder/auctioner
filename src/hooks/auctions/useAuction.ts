import { useFetch } from "../../lib/web";
import { Auction } from "../../queries/Auction";

const useAuction = (auctionId?: string) => {
  return useFetch<Auction>(auctionId ? `/api/v1/auctions/${auctionId}` : null, {
    revalidateOnFocus: false,
  });
};

export default useAuction;
