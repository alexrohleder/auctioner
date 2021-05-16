import Link from "next/link";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import useCategories from "../../hooks/categories/useCategories";

function Categories() {
  const categories = useCategories();

  if (categories.error) {
    return (
      <Layout title="Categories">
        <div className="mt-8 text-center">
          Unable to fetch your categories, are you connect to the internet?
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Categories">
      <div className="custom-container py-8">
        <div className="flex gap-8 mb-8">
          <input
            type="search"
            className="flex-1 rounded"
            placeholder="Search categories..."
            autoFocus
          />
          <Link href="/categories/new">
            <a className="btn btn--primary">New Category</a>
          </Link>
        </div>
        {categories.data?.length && (
          <div className="flex flex-col gap-2">
            {categories.data.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <a className="hover:bg-gray-50 px-4 py-2 border rounded">
                  {category.name}
                </a>
              </Link>
            ))}
          </div>
        )}
        {categories.data?.length === 0 && (
          <div className="lg:col-span-2 text-center">
            You don't have any category yet.
            <div className="mt-2">
              <Link href="/categories/new">
                <a className="btn btn--primary">New Category</a>
              </Link>
            </div>
          </div>
        )}
        {categories.isValidating && (
          <div className="flex justify-center mt-16">
            <Loading />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Categories;
