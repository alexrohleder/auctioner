import Link from "next/link";
import DashboardStatisticCard from "../components/DashboardStatisticCard";
import Layout from "../components/Layout";
import AuctionCard from "../components/AuctionCard";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import Loading from "../components/Loading";
import { url, useFetch } from "../lib/fetch";
import { formatMoney } from "../lib/format";

export default function Home() {
  let activities;

  const { user } = useContext(AuthContext);
  const auctions = useFetch(() => url("/api/auction", { sellerId: user.id }));
  const statistics = useFetch(() => `/api/seller/${user.id}/statistics`);

  return (
    <Layout title="Dashboard">
      <div className="lg:pb-16 px-4 pt-8 pb-12 border-b">
        <div className="custom-container">
          <div className="lg:grid-cols-4 grid flex-1 gap-4">
            <DashboardStatisticCard
              title="Total of bids"
              currentValue={statistics.data?.total_bids}
              previousValue={statistics.data?.total_bids_from}
              info={`In ${
                statistics.data?.total_auctions -
                statistics.data?.total_settled_auctions
              } open auctions`}
            />
            <DashboardStatisticCard
              title="Revenue"
              currentValue={statistics.data?.revenue}
              previousValue={statistics.data?.revenue_from}
              format={(value) => (value ? formatMoney(value, "NOK") : "N/A")}
            />
            <DashboardStatisticCard
              title="Convertion rate"
              currentValue={statistics.data?.convertion_rate}
              previousValue={statistics.data?.convertion_rate_from}
              format={(value) => `${value}%`}
              info={`Out of ${statistics.data?.views} page views`}
              description="Percentage of visits that resulted in a bid"
            />
            <div className="flex items-center justify-center">
              <Link href="/auction/new">
                <a className="btn btn--primary">New Auction</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container lg:grid-cols-4 grid gap-4 transform -translate-y-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {auctions.data?.length === 0 && (
              <div className="pt-16 text-center">
                <div className="mb-2">No auctions yet</div>
                <Link href="/auction/new">
                  <a className="btn">Create First Auction</a>
                </Link>
              </div>
            )}
            {auctions.data?.length > 0 &&
              auctions.data.map((auction) => (
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
                />
              ))}
            {auctions.isValidating && (
              <div className="flex justify-center pt-16">
                <Loading />
              </div>
            )}
          </div>
          <div className="lg:mt-0 lg:grid-col-span-2 mt-4">
            <div className="font-semibold">Recent Activity</div>
            <div className="flex flex-col gap-4 py-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
