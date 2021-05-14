import Link from "next/link";
import { ReactNode } from "react";
import { money } from "../lib/format";
import { AuctionResource } from "../resources/AuctionResource";

type Props = AuctionResource & {
  withImages?: boolean;
};

function Statistic(props: {
  title: string;
  value: string | number | ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-gray-500">{props.title}</div>
      {props.value}
    </div>
  );
}

function AuctionCard(props: Props) {
  return (
    <div className="bg-white border rounded shadow-sm">
      {props.withImages && (
        <div className="h-64 border-b">
          <div className="placeholder" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center h-8 mb-4">
          <div className="overflow-ellipsis overflow-hidden text-xl font-semibold">
            <Link href={`/auction/${props.id}`}>
              <a>{props.title}</a>
            </Link>
          </div>
        </div>
        <div className="h-12">
          <div className="grid items-center h-full grid-cols-4 gap-2">
            <Statistic
              title="Highest bid"
              value={props.lastBidAmount ? money(props.lastBidAmount) : "N/A"}
            />
            <Statistic
              title="Last bid"
              value={props.lastBidCreatedAt || "N/A"}
            />
            <Statistic title="Total bids" value={props.totalBids} />
            <Statistic title="Total bidders" value={props.totalBidders} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between h-12 px-4 border-t">
        <div>
          <Link href={`/auctions/${props.id}`}>
            <a className="text-semibold hover:underline text-blue-700">
              See stats
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;
