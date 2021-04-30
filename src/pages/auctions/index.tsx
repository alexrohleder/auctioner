import Layout from "../../components/Layout";

function Auctions() {
  return (
    <Layout title="Auctions">
      <div className="custom-container py-8">
        <input
          type="search"
          className="w-full"
          placeholder="Search auctions..."
          autoFocus
        />
      </div>
    </Layout>
  );
}

export default Auctions;
