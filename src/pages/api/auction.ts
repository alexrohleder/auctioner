import api from "../../lib/api";
import supabase from "../../lib/supabase";

export default api.get(async (req, res) => {
  res.json(await supabase.from("auctions"));
});
