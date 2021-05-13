import Link from "next/link";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { url, useFetch } from "../../lib/web";

function Categories() {
  const categories = useFetch(url("/api/v1/categories"));

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
        {categories.data?.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Creator</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.data.map((category) => (
                <tr key={category.id}>
                  <td>{category.creatorId}</td>
                  <td>{category.name}</td>
                  <td>{category.createdAt}</td>
                  <td>{category.updatedAt}</td>
                  <td>
                    <Link href={`/categories/${category.id}`}>
                      <a className="hover:underline text-blue-700">edit</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
