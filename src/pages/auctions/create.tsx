import Layout from "../../components/Layout";

function CreateAuction() {
  return (
    <Layout title="New Auction">
      <div className="border-b px-4 py-8">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Auction</div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="custom-container py-8 grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="border bg-white shadow-sm rounded p-4">
              <div className="font-semibold mb-8">General Information</div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="label" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="border bg-white shadow-sm rounded p-4">
              <div className="font-semibold mb-8">Organize Item</div>
            </div>
            <div className="border bg-white shadow-sm rounded p-4">
              <div className="font-semibold mb-8">Visibility</div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 w-full">
        <div className="custom-container">
          <div className="bg-white border rounded shadow-lg flex gap-2 justify-end p-2">
            <button className="btn">Cancel</button>
            <button className="btn btn--primary">Save</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAuction;
