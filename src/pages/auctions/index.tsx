import Link from "next/link";
import AuctionCard from "../../components/AuctionCard";
import AuctionCardPlaceholder from "../../components/AuctionCardPlaceholder";
import Layout from "../../components/Layout";
import useQuery from "../../hooks/useQuery";

function Auctions() {
  const [auctions, error, isLoading] = useQuery("auctions");

  if (error) {
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
          {isLoading ? (
            <>
              <AuctionCardPlaceholder withImages />
              <AuctionCardPlaceholder withImages />
              <AuctionCardPlaceholder withImages />
              <AuctionCardPlaceholder withImages />
            </>
          ) : (
            <>
              {auctions?.length === 0 ? (
                <div className="lg:col-span-2 text-center">
                  You don't have any auction yet.
                  <div className="mt-2">
                    <Link href="/auction/new">
                      <a className="btn btn--primary">New Auction</a>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {auctions?.map((auction) => (
                    <AuctionCard key={auction.id} {...auction} withImages />
                  ))}
                  <Link href="/auctions/new">
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Auctions;
