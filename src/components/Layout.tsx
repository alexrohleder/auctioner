import Head from "next/head";
import LayoutHeader from "./LayoutHeader";

type Props = {
  title: string;
  children: React.ReactNode;
};

function Layout(props: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{props.title} - Auctioner</title>
      </Head>
      <LayoutHeader />
      <div className="flex flex-col flex-1">{props.children}</div>
      <div className="py-8 border-t">
        <div className="custom-container">
          <div className="w-12 h-12 mb-4 bg-gray-300 rounded" />
          Copyright © 2021 Auctioner Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Layout;
