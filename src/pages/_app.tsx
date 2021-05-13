import { AppProps } from "next/dist/next-server/lib/router/router";
import "../assets/main.css";
import UserContext from "../contexts/UserContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserContext.Provider
      value={{ id: "f501c593-206a-4406-bb9e-8197c55b2f98" }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default App;
