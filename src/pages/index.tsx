import Link from "next/link";

function Home() {
  return (
    <div>
      <div className="border-b">
        <header className="custom-container">
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <a>
                <div className="w-12 h-12 bg-gray-300 rounded" />
              </a>
            </Link>
            <div>
              <Link href="/">
                <a className="btn btn--primary">Go to dashboard</a>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default Home;
