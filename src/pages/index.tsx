import DashboardCard from "../components/DashboardCard";
import Layout from "../components/Layout";
import useQuery from "../hooks/useQuery";

export default function Home() {
  const [statistics] = useQuery<any>("dashboard_statistics");
  const [auctions, error, loading] = useQuery<any>("dashboard_auctions");

  console.log(statistics);

  return (
    <Layout title="Dashboard">
      <div className="border-b px-4 pt-8 pb-16">
        <div className="container mx-auto max-w-screen-lg px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="grid lg:grid-cols-3 gap-4 flex-1">
              <DashboardCard
                title="Total of bids"
                value={statistics?.[0].total_bids}
                change={1}
                changeText={`from ${statistics?.[0].total_bids_from}`}
                annotation={`In ${statistics?.[0].open_auctions} open auctions`}
              />
              <DashboardCard
                title="Revenue"
                value={
                  statistics?.[0].revenue && `kr${statistics?.[0].revenue}`
                }
                change={1}
                changeText={`from kr${statistics?.[0].revenue_from}`}
              />
              <DashboardCard
                title="Convertion rate"
                value="47.04%"
                change={-1}
                changeText="from 55.34%"
                annotation="Out of 8623 page views"
                info="Percentage of visits that resulted in a bid"
              />
            </div>
            <div className="flex items-center justify-center">
              <button className="bg-gray-800 text-white rounded py-2 px-4">
                New Auction
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto max-w-screen-lg px-4 transform -translate-y-8 flex flex-col lg:flex-row gap-4">
          <div className="lg:w-[555px]">
            {auctions &&
              auctions.map((auction) => (
                <div
                  className="border block rounded bg-white mb-4 break-words shadow-sm hover:border-blue-700 transition-colors cursor-pointer"
                  key={auction.id}
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="text-xl font-semibold">{auction.title}</div>
                    <div className="flex gap-4 items-center">
                      <div className="text-green-500 flex gap-2 text-xs items-center">
                        Published
                        <div
                          className="w-1 h-1 bg-green-500 rounded-full"
                          title="This auction is public and open"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-4">
                    <div className="text-gray-500 text-sm">Highest bid</div>
                    <div>kr1.250,00</div>
                    <div className="text-gray-500 text-sm">Last bid</div>
                    <div>2 minutes ago</div>
                    <div className="text-gray-500 text-sm">Total bids</div>
                    <div>13</div>
                    <div className="text-gray-500 text-sm">Total bidders</div>
                    <div>4</div>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-sm border-t mt-4">
                    <div className="flex gap-2">
                      <a className="text-blue-700 hover:underline" href="">
                        View Statistics
                      </a>
                      ·
                      <a className="text-blue-700 hover:underline" href="">
                        Edit
                      </a>
                      ·
                      <a className="text-blue-700 hover:underline" href="">
                        Settle
                      </a>
                    </div>
                    <div className="text-gray-500">Created 7 days ago</div>
                  </div>
                </div>
              ))}
            <div className="border rounded bg-gray-100 mb-4 break-words shadow-sm hover:border-blue-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-center p-4">
                <div className="text-xl font-semibold">
                  Something with very long name...
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-red-500 flex gap-2 text-xs items-center">
                    <div
                      className="w-1 h-1 bg-red-500 rounded-full"
                      title="This auction is public and open"
                    />
                    Unpublished
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-4">
                <div className="text-gray-500 text-sm">Highest bid</div>
                <div>kr1.250,00</div>
                <div className="text-gray-500 text-sm">Last bid</div>
                <div>2 minutes ago</div>
                <div className="text-gray-500 text-sm">Total bids</div>
                <div>13</div>
                <div className="text-gray-500 text-sm">Total bidders</div>
                <div>4</div>
              </div>
              <div className="px-4 py-2 flex justify-between text-sm border-t mt-4">
                <div className="flex gap-2">
                  <a className="text-blue-700 hover:underline" href="">
                    View Statistics
                  </a>
                </div>
                <div className="text-gray-500">Created 7 days ago</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold">Recent Activity</div>
            <div className="py-4">
              {[...Array(12)].map((_, key) => (
                <div
                  key={key}
                  className="flex flex-row items-center py-2 border-b"
                >
                  <div className="w-6 mr-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="flex-grow text-gray-700 text-sm">
                    You got a new bid of kr
                    <div className="inline text-black">1.250,00</div>
                  </div>
                  <div className="ml-4 text-sm font-light text-right text-gray-700">
                    {key}min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
