import Link from "next/link";
import DashboardStatisticCard from "../components/DashboardStatisticCard";
import AuctionCardPlaceholder from "../components/AuctionCardPlaceholder";
import Layout from "../components/Layout";

export default function Home() {
  let statistics, auctions, activities;

  return (
    <Layout title="Dashboard">
      <div className="lg:pb-16 px-4 pt-8 pb-12 border-b">
        <div className="custom-container">
          <div className="lg:grid-cols-4 grid flex-1 gap-4">
            <DashboardStatisticCard
              title="Total of bids"
              currentValue={statistics?.total_bids}
              previousValue={statistics?.total_bids_from}
              info={`In ${statistics?.open_auctions} open auctions`}
            />
            <DashboardStatisticCard
              title="Revenue"
              currentValue={statistics?.revenue}
              previousValue={statistics?.revenue_from}
              format={(value) => `kr${value}`}
            />
            <DashboardStatisticCard
              title="Convertion rate"
              currentValue={statistics?.convertion_rate}
              previousValue={statistics?.convertion_rate_from}
              format={(value) => `${value}%`}
              info={`Out of ${statistics?.page_views} page views`}
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
            {!auctions && (
              <>
                <AuctionCardPlaceholder />
                <AuctionCardPlaceholder />
                <AuctionCardPlaceholder />
                <AuctionCardPlaceholder />
                <AuctionCardPlaceholder />
              </>
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
