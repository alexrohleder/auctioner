import Head from "next/head";
import LayoutHeader from "./LayoutHeader";

type Props = {
  title: string;
  children: React.ReactNode;
};

function Layout(props: Props) {
  return (
    <div>
      <Head>
        <title>{props.title} - Auctioner</title>
      </Head>
      <LayoutHeader />
      {props.children}
    </div>
  );
}

export default Layout;
