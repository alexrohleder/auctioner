function DashboardAuctionCardPlaceholder() {
  return (
    <div className="border rounded bg-white shadow-sm">
      <div className="p-4">
        <div className="placeholder h-6 w-48" />
        <div className="h-28" />
      </div>
      <div className="px-4 py-2 border-t flex justify-between">
        <div className="placeholder h-4 w-16" />
        <div className="placeholder h-4 w-24" />
      </div>
    </div>
  );
}

export default DashboardAuctionCardPlaceholder;
