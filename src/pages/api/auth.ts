import api from "../../lib/api";
import supabase from "../../lib/supabase";

export default api().post((req, res) => {
  supabase.auth.api.setAuthCookie(req, res);
});
