function DashboardAuctionCardPlaceholder() {
  return (
    <div className="bg-white border rounded shadow-sm">
      <div className="p-4">
        <div className="placeholder w-48 h-6" />
        <div className="h-28" />
      </div>
      <div className="flex justify-between px-4 py-2 border-t">
        <div className="placeholder w-16 h-4" />
        <div className="placeholder w-24 h-4" />
      </div>
    </div>
  );
}

export default DashboardAuctionCardPlaceholder;
