import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { url, useFetch } from "../../lib/web";
import { AuctionResource } from "../../resources/AuctionResource";

const useAuctions = () => {
  const user = useContext(UserContext);

  return useFetch<AuctionResource[]>(
    user ? url("/api/v1/auctions", { sellerId: user.id }) : null
  );
};

export default useAuctions;
