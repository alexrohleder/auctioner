import supabase from "../lib/supabase";

export const createAuctionView = async (payload: {
  session_id: string;
  auction_id: string;
  referrer?: string;
}) => {
  const { data, error } = await supabase.from("auction_views").insert(payload);

  if (error) {
    throw error;
  }

  return data;
};
