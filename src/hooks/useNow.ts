import { useEffect, useState } from "react";

function useNow() {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(new Date().toISOString().substr(0, "yyyy-mm-ddThh:mm".length));
  }, []);

  return now;
}

export default useNow;
