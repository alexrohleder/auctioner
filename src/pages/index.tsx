import DashboardStatisticCard from "../components/DashboardStatisticCard";
import DashboardAuctionCardPlaceholder from "../components/DashboardAuctionCardPlaceholder";
import Layout from "../components/Layout";

export default function Home() {
  let statistics, auctions, activities;

  return (
    <Layout title="Dashboard">
      <div className="border-b px-4 pt-8 pb-12 lg:pb-16">
        <div className="custom-container">
          <div className="grid lg:grid-cols-4 gap-4 flex-1">
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
              <button className="btn btn--primary">New Auction</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="custom-container transform -translate-y-8 grid lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-8 lg:col-span-2">
            {!auctions && (
              <>
                <DashboardAuctionCardPlaceholder />
                <DashboardAuctionCardPlaceholder />
                <DashboardAuctionCardPlaceholder />
                <DashboardAuctionCardPlaceholder />
                <DashboardAuctionCardPlaceholder />
              </>
            )}
          </div>
          <div className="mt-4 lg:mt-0 lg:grid-col-span-2">
            <div className="font-semibold">Recent Activity</div>
            <div className="flex flex-col gap-4 py-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
