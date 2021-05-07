import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthContextProvider } from "../contexts/AuthContext";
import "../assets/main.css";
import { useEffect } from "react";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const post = (url, data, callback) => {
      const req = new XMLHttpRequest();
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/json");

      req.onreadystatechange = () => {
        if (req.readyState === 4) {
          callback && callback(req.response);
        }
      };

      req.send(JSON.stringify(data));
    };

    const {
      screen: { width, height },
      navigator: { language },
      location: { hostname, pathname, search },
    } = window;

    post(
      "/api/collect",
      {
        payload: {
          auctionId: "e283c92f-152b-4624-a2b4-d4e4e72f259a",
          hostname,
          screen: `${width}x${height}`,
          language,
        },
      },
      console.log
    );
  }, []);

  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default App;
