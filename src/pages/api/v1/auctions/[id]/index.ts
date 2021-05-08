import api from "../../../../../lib/api";
import { getAuction } from "../../../../../lib/queries";

export default api().get(async (req, res) => {
  res.json(await getAuction("e283c92f-152b-4624-a2b4-d4e4e72f259a"));
});
