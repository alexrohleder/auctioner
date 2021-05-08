import api from "../../../../lib/api";
import { getAuctions } from "../../../../lib/queries";

export default api().get(async (req, res) => {
  res.json(await getAuctions({}));
});
