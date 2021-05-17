import { useFetch } from "../../lib/web";
import { AuctionResource } from "../../resources/AuctionResource";

const useAuction = (auctionId?: string) => {
  return useFetch<AuctionResource>(
    auctionId ? `/api/v1/auctions/${auctionId}` : null,
    { revalidateOnFocus: false }
  );
};

export default useAuction;
