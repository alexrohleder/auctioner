function LayoutHeader() {
  return (
    <div className="border-b">
      <header className="custom-container">
        <div className="flex justify-between py-4">
          <div className="w-12 h-12 bg-gray-300 rounded" />
          <div className="flex items-center gap-4">
            <div>Feedback</div>
            <div>Support</div>
            <div>Docs</div>
            <div className="w-10 h-10 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <div className="flex items-center h-12 px-4 border-b-2 border-gray-800">
            Dashboard
          </div>
          <div className="flex items-center h-12 px-4 border-b-2 border-transparent">
            Auctions
          </div>
          <div className="flex items-center h-12 px-4 border-b-2 border-transparent">
            Activities
          </div>
          <div className="flex items-center h-12 px-4 border-b-2 border-transparent">
            Statistics
          </div>
          <div className="flex items-center h-12 px-4 border-b-2 border-transparent">
            Settings
          </div>
        </div>
      </header>
    </div>
  );
}

export default LayoutHeader;
