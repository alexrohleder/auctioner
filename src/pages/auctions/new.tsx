import Layout from "../../components/Layout";

function CreateAuction() {
  return (
    <Layout title="New Auction">
      <div className="px-4 py-8 border-b">
        <div className="custom-container">
          <div className="text-4xl font-semibold">New Auction</div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="custom-container lg:grid-cols-5 grid gap-4 py-8">
          <div className="lg:col-span-3">
            <div className="p-4 bg-white border rounded shadow-sm">
              <div className="mb-8 font-semibold">General Information</div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="label" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 sm:text-sm block w-full mt-1 border-gray-300 rounded shadow-sm"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="focus:ring-blue-500 focus:border-blue-500 sm:text-sm block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-4 bg-white border rounded shadow-sm">
              <div className="mb-8 font-semibold">Organize Item</div>
            </div>
            <div className="p-4 bg-white border rounded shadow-sm">
              <div className="mb-8 font-semibold">Visibility</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-4 fixed w-full">
        <div className="custom-container">
          <div className="flex justify-end gap-2 p-2 bg-white border rounded shadow-lg">
            <button className="btn">Cancel</button>
            <button className="btn btn--primary">Save</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAuction;
