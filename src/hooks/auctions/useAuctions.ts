import { url, useFetch } from "../../lib/web";
import { Auction } from "../../queries/Auction";

const useAuctions = () => {
  return useFetch<Auction[]>(url("/api/v1/auctions"));
};

export default useAuctions;
