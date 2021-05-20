import { AppProps } from "next/dist/next-server/lib/router/router";
import { Provider as SessionProvider } from "next-auth/client";
import { ToastContainer } from "react-toastify";
import { ComponentType } from "react";
import AuthenticationGuard from "../components/AuthGuard";
import "../assets/main.css";
import "react-toastify/dist/ReactToastify.css";

type Props = AppProps & {
  Component: ComponentType & {
    isPublic?: boolean;
  };
};

function App({ Component, pageProps }: Props) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthenticationGuard>
        <Component {...pageProps} />
      </AuthenticationGuard>
      <ToastContainer position="bottom-right" limit={3} pauseOnHover={false} />
    </SessionProvider>
  );
}

export default App;
