import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { url, useFetch } from "../../lib/web";
import { money } from "../../lib/format";

const startAt = new Date(2000, 12, 12);
const endAt = new Date();

function Auction() {
  const router = useRouter();

  const {
    data: {
      currency_code,
      total_bidders,
      total_bids,
      last_bid_amount,
      last_bid_created_at,
    } = {},
  } = useFetch(
    router.query.auctionId ? `/api/v1/auctions/${router.query.auctionId}` : null
  );

  const { data: { views = 0, uniques = 0, bounces, time } = {} } = useFetch(
    router.query.id
      ? url("/api/auction/stats", {
          auctionId: router.query.auctionId,
          startAt,
          endAt,
        })
      : null
  );

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
              {avgVisitTime}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Bidders</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {total_bidders}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Bids</div>
            <div className="h-8 mb-1 text-2xl font-semibold">{total_bids}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Highest Bid</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {last_bid_amount ? money(last_bid_amount, currency_code) : "N/A"}
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-700">Last Bid</div>
            <div className="h-8 mb-1 text-2xl font-semibold">
              {last_bid_created_at}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Auction;
