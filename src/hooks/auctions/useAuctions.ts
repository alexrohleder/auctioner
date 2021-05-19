import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { url, useFetch } from "../../lib/web";
import { Auction } from "../../queries/Auction";

const useAuctions = () => {
  const user = useContext(UserContext);

  return useFetch<Auction[]>(
    user ? url("/api/v1/auctions", { sellerId: user.id }) : null
  );
};

export default useAuctions;
