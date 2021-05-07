import supabase from "../lib/supabase";

export const createSession = async (payload: {
  id: string;
  hostname: string;
  browser: string;
  os: string;
  screen: string;
  language: string;
  country: string;
  device: string;
}) => {
  const { data, error } = await supabase.from("sessions").insert(payload);

  if (error) {
    throw error;
  }

  return data;
};

export const getSessionById = async (id: string) => {
  const { data, error } = await supabase
    .from("sessions")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
