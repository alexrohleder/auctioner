import Link from "next/link";
import DashboardStatisticCard from "../components/DashboardStatisticCard";
import Layout from "../components/Layout";
import AuctionCard from "../components/AuctionCard";
import Loading from "../components/Loading";
import { money } from "../lib/format";
import useAuctions from "../hooks/auctions/useAuctions";

export default function Home() {
  let activities, statistics;
  const auctions = useAuctions();

  return (
    <Layout title="Dashboard">
      <div className="lg:pb-16 px-4 pt-8 pb-12 border-b">
        <div className="custom-container">
          <div className="lg:grid-cols-4 grid flex-1 gap-4">
            <DashboardStatisticCard
              title="Total of bids"
              currentValue={statistics?.total_bids}
              previousValue={statistics?.total_bids_from}
              info={`In ${
                statistics?.total_auctions - statistics?.total_settled_auctions
              } open auctions`}
            />
            <DashboardStatisticCard
              title="Revenue"
              currentValue={statistics?.revenue}
              previousValue={statistics?.revenue_from}
              format={(value) => (value ? money(value) : "N/A")}
            />
            <DashboardStatisticCard
              title="Convertion rate"
              currentValue={statistics?.convertion_rate}
              previousValue={statistics?.convertion_rate_from}
              format={(value) => `${value}%`}
              info={`Out of ${statistics?.views} page views`}
              description="Percentage of visits that resulted in a bid"
            />
            <div className="flex items-center justify-center">
              <Link href="/auctions/new">
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
                <Link href="/auctions/new">
                  <a className="btn">Create First Auction</a>
                </Link>
              </div>
            )}
            {auctions.data?.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
            {auctions.isValidating && (
              <div className="flex justify-center pt-16">
                <Loading />
              </div>
            )}
          </div>
          <div className="lg:mt-0 lg:grid-col-span-2 mt-4">
            <div className="font-semibold">Recent Activity</div>
            <div className="flex flex-col gap-4 py-4">No activities yet.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
