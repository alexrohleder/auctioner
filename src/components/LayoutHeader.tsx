function LayoutHeader() {
  return (
    <div className="border-b">
      <header className="custom-container">
        <div className="flex justify-between py-4">
          <div className="h-12 w-12 bg-gray-300 rounded" />
          <div className="flex gap-4 items-center">
            <div>Feedback</div>
            <div>Support</div>
            <div>Docs</div>
            <div className="h-10 w-10 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="border-b-2 px-4 border-gray-800 h-12 flex items-center">
            Dashboard
          </div>
          <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
            Auctions
          </div>
          <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
            Activities
          </div>
          <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
            Statistics
          </div>
          <div className="border-b-2 px-4 border-transparent h-12 flex items-center">
            Settings
          </div>
        </div>
      </header>
    </div>
  );
}

export default LayoutHeader;
