import { AppProps } from "next/dist/next-server/lib/router/router";
import { ToastContainer } from "react-toastify";
import UserContext from "../contexts/UserContext";
import "../assets/main.css";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserContext.Provider
      value={{ id: "f501c593-206a-4406-bb9e-8197c55b2f98" }}
    >
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" limit={3} />
    </UserContext.Provider>
  );
}

export default App;
