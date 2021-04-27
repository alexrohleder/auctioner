import { Provider as AuthProvider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import "tailwindcss/tailwind.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
