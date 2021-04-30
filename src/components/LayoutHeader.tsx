import Link from "next/link";
import LayoutHeaderNavigationLink from "./LayoutHeaderNavigationLink";

function LayoutHeader() {
  return (
    <div className="border-b">
      <header className="custom-container">
        <div className="flex justify-between py-4">
          <Link href="/">
            <a>
              <div className="w-12 h-12 bg-gray-300 rounded" />
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hover:text-black text-gray-500 cursor-pointer">
              Feedback
            </div>
            <div className="hover:text-black text-gray-500 cursor-pointer">
              Support
            </div>
            <div className="hover:text-black text-gray-500 cursor-pointer">
              Docs
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <LayoutHeaderNavigationLink href="/dashboard">
            Dashboard
          </LayoutHeaderNavigationLink>
          <LayoutHeaderNavigationLink href="/auctions">
            Auctions
          </LayoutHeaderNavigationLink>
          <LayoutHeaderNavigationLink href="/activities">
            Activities
          </LayoutHeaderNavigationLink>
          <LayoutHeaderNavigationLink href="/statistics">
            Statistics
          </LayoutHeaderNavigationLink>
          <LayoutHeaderNavigationLink href="/settings">
            Settings
          </LayoutHeaderNavigationLink>
        </div>
      </header>
    </div>
  );
}

export default LayoutHeader;
