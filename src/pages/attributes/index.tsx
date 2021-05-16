import Link from "next/link";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import useAttributes from "../../hooks/attributes/useAttributes";

function Attributes() {
  const attributes = useAttributes();

  if (attributes.error) {
    return (
      <Layout title="Attributes">
        <div className="mt-8 text-center">
          Unable to fetch your attributes, are you connect to the internet?
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Attributes">
      <div className="custom-container py-8">
        <div className="flex gap-8 mb-8">
          <input
            type="search"
            className="flex-1 rounded"
            placeholder="Search attributes..."
            autoFocus
          />
          <Link href="/attributes/new">
            <a className="btn btn--primary">New Attribute</a>
          </Link>
        </div>
        {attributes.data?.length && (
          <div className="flex flex-col gap-2">
            {attributes.data.map((attribute) => (
              <Link key={attribute.id} href={`/attributes/${attribute.id}`}>
                <a
                  key={attribute.id}
                  className="hover:bg-gray-50 px-4 py-2 border rounded"
                >
                  {attribute.name}
                </a>
              </Link>
            ))}
          </div>
        )}
        {attributes.data?.length === 0 && (
          <div className="lg:col-span-2 text-center">
            You don't have any attribute yet.
            <div className="mt-2">
              <Link href="/attributes/new">
                <a className="btn btn--primary">New Attribute</a>
              </Link>
            </div>
          </div>
        )}
        {attributes.isValidating && (
          <div className="flex justify-center mt-16">
            <Loading />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Attributes;
