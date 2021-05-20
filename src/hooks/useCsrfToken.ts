import { getCsrfToken } from "next-auth/client";
import { useEffect, useState } from "react";

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getCsrfToken().then((token) => {
      setCsrfToken(token || "");
    });
  }, []);

  return csrfToken;
};

export default useCsrfToken;
