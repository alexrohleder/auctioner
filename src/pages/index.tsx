import DashboardStatisticCard from "../components/DashboardStatisticCard";
import DashboardAuctionCardPlaceholder from "../components/DashboardAuctionCardPlaceholder";
import Layout from "../components/Layout";

export default function Home() {
  let statistics, auctions, activities;

  return (
    <Layout title="Dashboard">
      <div className="border-b px-4 pt-8 pb-16">
        <div className="container mx-auto max-w-screen-lg px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="grid lg:grid-cols-3 gap-4 flex-1">
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
            </div>
            <div className="flex items-center justify-center">
              <button className="btn btn--primary">New Auction</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto max-w-screen-lg px-4 transform -translate-y-8 flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-8 lg:w-[552px]">
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
          <div className="flex-1">
            <div className="font-semibold">Recent Activity</div>
            <div className="flex flex-col gap-4 py-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
