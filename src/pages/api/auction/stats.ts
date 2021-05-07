import api from "../../../lib/api";
import { getAuctionStats } from "../../../lib/queries";

export default api().get(async (req, res) => {
  res.json(
    await getAuctionStats(
      "e283c92f-152b-4624-a2b4-d4e4e72f259a",
      new Date(20, 12, 2000),
      new Date()
    )
  );
});
