import useQuery from "../hooks/useQuery";

export default function Home() {
  const [auctions, error, loading] = useQuery<any>("dashboard_auctions");

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto max-w-screen-lg px-4">
          <div className="flex justify-between py-4">
            <div className="h-12 w-12 bg-gray-300 rounded" />
            <div className="flex gap-4 items-center">
              <div>Feedback</div>
              <div>Support</div>
              <div>Docs</div>
              <div className="h-10 w-10 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="border-b-2 px-4 border-gray-800 h-12 flex items-center">
              Dashboard
            </div>
            <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
              Auctions
            </div>
            <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
              Activities
            </div>
            <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
              Statistics
            </div>
            <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
              Settings
            </div>
          </div>
        </div>
      </div>
      <div className="border-b px-4 pt-8 pb-16">
        <div className="container mx-auto max-w-screen-lg px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="grid lg:grid-cols-3 gap-4 flex-1">
              <div className="border rounded p-4">
                <div className="font-semibold">Total of bids</div>
                <div className="text-lg">41</div>
                <div className="text-xs mt-1 flex justify-between">
                  <div className="text-green-600 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    from 23
                  </div>
                  <div className="text-gray-500">In 3 open auctions</div>
                </div>
              </div>
              <div className="border rounded p-4">
                <div className="font-semibold">Revenue</div>
                <div className="text-lg">kr10,000.00</div>
                <div className="text-xs mt-1 flex justify-between">
                  <div className="text-green-600 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    from kr9,000.00
                  </div>
                  <div className="text-gray-500">Expecting kr7,500.00</div>
                </div>
              </div>
              <div className="border rounded p-4">
                <div className="flex justify-between">
                  <div className="font-semibold">Convertion rate</div>
                  <div
                    className="text-gray-400"
                    title="Percentage of visits that resulted in a bid"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-lg">47.04%</div>
                <div className="text-xs mt-1 flex justify-between">
                  <div className="text-red-600 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                    from 55.34%
                  </div>
                  <div className="text-gray-500">Out of 8623 page views</div>
                </div>
              </div>
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
                <a
                  href=""
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
                </a>
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
                  <p className="flex-grow text-gray-700 text-sm">
                    You got a new bid of kr
                    <div className="inline text-black">1.250,00</div>
                  </p>
                  <div className="ml-4 text-sm font-light text-right text-gray-700">
                    {key}min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
