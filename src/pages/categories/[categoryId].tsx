import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { useFetch } from "../../lib/web";

function Category() {
  const { query } = useRouter();
  const { categoryId } = query;
  const category = useFetch(
    categoryId ? `/api/v1/categories/${categoryId}` : null
  );

  if (category.error) {
    return (
      <Layout title="Category">
        <div className="mt-8 text-center">
          Unable to fetch the requested category
        </div>
      </Layout>
    );
  }

  const title = category.data ? `${category.data.name} - Category` : "Category";

  return (
    <Layout title={title}>
      <div className="custom-container py-8">
        {category.data && <pre>{JSON.stringify(category.data, null, 4)}</pre>}
        {category.isValidating && (
          <div className="flex justify-center mt-16">
            <Loading />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Category;
