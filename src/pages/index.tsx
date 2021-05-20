import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/client";

function Home() {
  // let session = null;
  const [session, loading] = useSession();

  return (
    <div>
      <Head>
        <title>Auctioner landing page</title>
      </Head>
      <div className="border-b">
        <header className="custom-container">
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <a>
                <div className="w-12 h-12 bg-gray-300 rounded" />
              </a>
            </Link>
            <div>
              <Link href="/dashboard">
                <a className="btn btn--primary">Go to dashboard</a>
              </Link>
            </div>
          </div>
        </header>
      </div>
      <pre>{JSON.stringify(session, null, 4)}</pre>
    </div>
  );
}

Home.isPublic = true;

export default Home;
