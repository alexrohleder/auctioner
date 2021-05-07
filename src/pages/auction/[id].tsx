import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import useFetch from "../../hooks/useFetch";
import { formatShortTime } from "../../lib/format";

const startAt = new Date(2000, 12, 12);
const endAt = new Date();

function Auction() {
  const router = useRouter();
  const auctionId = router.query.id;
  const query = { auctionId, startAt, endAt };
  const { data = {} } = useFetch("/api/auction/stats", query);
  const { views, uniques, bounces, time } = data;
  const bounceRate = uniques ? (Math.min(uniques, bounces) / uniques) * 100 : 0;
  const avgVisitTime = time && views ? time / (views - bounces) : 0;

  return (
    <Layout title="Auction">
      <div className="custom-container py-8">
        <div className="lg:grid-cols-4 grid flex-1 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Views</div>
            <div className="h-8 mb-1 text-2xl font-semibold">{views}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Visitors</div>
            <div className="h-8 mb-1 text-2xl font-semibold">{uniques}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Bounce rate</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {bounceRate ? bounceRate.toFixed() + "%" : 0}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Average visit time</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {formatShortTime(avgVisitTime, ["m", "s"], " ")}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Bidders</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {data.bidders}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Bids</div>
            <div className="h-8 mb-1 text-2xl font-semibold">{data.bids}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Highest Bid</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {data.highest_bid}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Last Bid</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {formatShortTime(avgVisitTime, ["m", "s"], " ")}
              ago
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Auction;
