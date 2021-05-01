import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthContextProvider } from "../contexts/AuthContext";
import "../assets/main.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default App;
