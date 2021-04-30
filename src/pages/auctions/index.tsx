import { useEffect } from "react";
import Layout from "../../components/Layout";
import useQuery from "../../hooks/useQuery";
import supabase from "../../lib/supabase";

function Auctions() {
  const [auctions, error, isLoading] = useQuery("auctions");

  useEffect(() => {
    (async () => {
      console.log(
        await supabase.storage
          .from("auction-images")
          .download("bcba6551-3bf9-4786-8f03-4ba13361904e.png")
      );
    })();
  }, []);

  return (
    <Layout title="Auctions">
      <div className="custom-container py-8">
        <input
          type="search"
          className="w-full"
          placeholder="Search auctions..."
          autoFocus
        />
        <pre>{JSON.stringify(auctions, null, 4)}</pre>
      </div>
    </Layout>
  );
}

export default Auctions;
