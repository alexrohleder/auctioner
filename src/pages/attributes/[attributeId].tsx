import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import useAttribute from "../../hooks/attributes/useAttribute";

function Attribute() {
  const router = useRouter();
  const attribute = useAttribute(router.query.attributeId as string);

  return (
    <Layout title="Attribute">
      <div className="custom-container py-8">
        <pre>{JSON.stringify(attribute, null, 4)}</pre>
      </div>
    </Layout>
  );
}

export default Attribute;
