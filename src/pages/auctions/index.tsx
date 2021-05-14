import Link from "next/link";
import AuctionCard from "../../components/AuctionCard";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import useAuctions from "../../hooks/auctions/useAuctions";

function Auctions() {
  const auctions = useAuctions();

  if (auctions.error) {
    return (
      <Layout title="Auctions">
        <div className="mt-8 text-center">
          Unable to fetch your auctions, are you connected to the internet?
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Auctions">
      <div className="custom-container py-8">
        <div className="flex gap-8 mb-8">
          <input
            type="search"
            className="flex-1 rounded"
            placeholder="Search auctions..."
            autoFocus
          />
          <Link href="/auctions/new">
            <a className="btn btn--primary">New Auction</a>
          </Link>
        </div>
        <div className="lg:grid-cols-2 grid gap-4">
          {auctions.data?.map((auction) => (
            <AuctionCard key={auction.id} {...auction} withImages />
          ))}
          {auctions.data?.length === 0 && (
            <div className="lg:col-span-2 text-center">
              You don't have any auction yet.
              <div className="mt-2">
                <Link href="/auctions/new">
                  <a className="btn btn--primary">New Auction</a>
                </Link>
              </div>
            </div>
          )}
        </div>
        {auctions.isValidating && (
          <div className="flex justify-center mt-16">
            <Loading />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Auctions;
