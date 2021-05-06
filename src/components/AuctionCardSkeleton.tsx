import { ReactNode } from "react";

type Props = {
  media?: ReactNode;
  title: ReactNode;
  statistics: ReactNode;
  footer: ReactNode;
};

function AuctionCardSkeleton(props: Props) {
  return (
    <div className="bg-white border rounded shadow-sm">
      {props.media && <div className="h-64 border-b">{props.media}</div>}
      <div className="p-4">
        <div className="flex items-center h-8 mb-4">{props.title}</div>
        <div className="h-12">{props.statistics}</div>
      </div>
      <div className="h-12 border-t">{props.footer}</div>
    </div>
  );
}

export default AuctionCardSkeleton;
