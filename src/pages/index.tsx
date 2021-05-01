import Link from "next/link";

function Home() {
  return (
    <div className="custom-container py-8">
      <div className="mb-5 font-semibold">Homepage</div>
      <p className="mt-1">
        <Link href="/dashboard">
          <a className="hover:underline text-blue-500">Dashboard</a>
        </Link>
      </p>
      <p className="mt-1">
        <Link href="/dashboard">
          <a className="hover:underline text-blue-500">Login</a>
        </Link>
      </p>
      <p className="mt-1">
        <Link href="/dashboard">
          <a className="hover:underline text-blue-500">Sign up</a>
        </Link>
      </p>
    </div>
  );
}

export default Home;
