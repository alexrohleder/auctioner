import AuctionCardSkeleton from "./AuctionCardSkeleton";

type Props = {
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
    <AuctionCardSkeleton
      media={props.withImages ? <div className="placeholder" /> : undefined}
      title={
        <div className="overflow-ellipsis overflow-hidden text-xl font-semibold">
          {props.title}
        </div>
      }
      statistics={
        <div className="grid items-center h-full grid-cols-4 gap-2">
          <Statistic title="Highest bid" value="kr1.200,00" />
          <Statistic title="Last bid" value="2 min. ago" />
          <Statistic title="Total bids" value="13" />
          <Statistic title="Total bidders" value="4" />
        </div>
      }
      footer={
        <>
          <div className="h-4" />
          <div className="h-4" />
        </>
      }
    />
  );
}

export default AuctionCard;
