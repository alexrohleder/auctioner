import Link from "next/link";
import { useEffect } from "react";
import AuctionCardPlaceholder from "../../components/AuctionCardPlaceholder";
import Layout from "../../components/Layout";
import useQuery from "../../hooks/useQuery";
import supabase from "../../lib/supabase";

function Auctions() {
  const [auctions, error, isLoading] = useQuery("auctions");

  useEffect(() => {
    (async () => {
      console.log(
        await supabase.storage
          .from("auction-images")
          .download("bcba6551-3bf9-4786-8f03-4ba13361904e.png")
      );
    })();
  }, []);

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
                auctions?.map((auction) => (
                  <pre>{JSON.stringify(auction, null, 4)}</pre>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Auctions;
