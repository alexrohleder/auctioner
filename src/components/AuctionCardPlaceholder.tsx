import AuctionCardSkeleton from "./AuctionCardSkeleton";

type Props = {
  withImages?: boolean;
};

function AuctionCardPlaceholder(props: Props) {
  return (
    <AuctionCardSkeleton
      media={props.withImages ? <div className="placeholder" /> : undefined}
      title={<div className="placeholder w-48" />}
      statistics={<div />}
      footer={
        <>
          <div className="placeholder w-16 h-4" />
          <div className="placeholder w-24 h-4" />
        </>
      }
    />
  );
}

export default AuctionCardPlaceholder;
