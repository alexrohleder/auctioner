import Link from "next/link";
import AuctionCard from "../../components/AuctionCard";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { url, useFetch } from "../../lib/web";

function Auctions() {
  const user = { id: "f501c593-206a-4406-bb9e-8197c55b2f98" };
  const auctions = useFetch(() =>
    url("/api/v1/auctions", { sellerId: user.id })
  );

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
        <input
          type="search"
          className="w-full mb-8 rounded"
          placeholder="Search auctions..."
          autoFocus
        />
        <div className="lg:grid-cols-2 grid gap-4">
          {auctions.data?.length === 0 && (
            <div className="lg:col-span-2 text-center">
              You don't have any auction yet.
              <div className="mt-2">
                <Link href="/auction/new">
                  <a className="btn btn--primary">New Auction</a>
                </Link>
              </div>
            </div>
          )}

          {auctions.data?.length && (
            <>
              {auctions.data?.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  id={auction.id}
                  title={auction.title}
                  description={auction.description}
                  currencyCode={auction.currency_code}
                  images={auction.images}
                  totalBids={auction.total_bids}
                  totalBidders={auction.total_bidders}
                  lastBidAmount={auction.last_bid_amount}
                  lastBidCreatedAt={auction.last_bid_created_at}
                  withImages
                />
              ))}
              <Link href="/auction/new">
                <a className="hover:bg-gray-50 flex flex-col items-center justify-center gap-1 font-semibold transition-colors bg-white border rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  New Auction
                </a>
              </Link>
            </>
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
