import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description: string;
  images: string[];
  withImages?: boolean;
};

function Statistic(props: { title: string; value: string }) {
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
            <Statistic title="Highest bid" value="kr1.200,00" />
            <Statistic title="Last bid" value="2 min. ago" />
            <Statistic title="Total bids" value="13" />
            <Statistic title="Total bidders" value="4" />
          </div>
        </div>
      </div>
      <div className="flex justify-around h-12 border-t">
        <div className="h-4" />
        <div className="h-4" />
      </div>
    </div>
  );
}

export default AuctionCard;
