import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import useAuction from "../../hooks/auctions/useAuction";
import useCloseAuction from "../../hooks/auctions/useCloseAuction";
import useReOpenAuction from "../../hooks/auctions/useReOpenAuction";
import useSettleAuction from "../../hooks/auctions/useSettleAuction";

function Auction() {
  const router = useRouter();
  const auction = useAuction(router.query.auctionId as string);
  const { settle, canSettle } = useSettleAuction();
  const { close, canClose } = useCloseAuction();
  const { reOpen, canReOpen } = useReOpenAuction();

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
        <pre>{JSON.stringify(auction, null, 4)}</pre>
      </div>
    </Layout>
  );
}

export default Auction;
