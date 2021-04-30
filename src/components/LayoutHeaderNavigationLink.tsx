import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

function LayoutHeaderNavigationLink(props: Props) {
  const router = useRouter();

  const colors = router.pathname.startsWith(props.href)
    ? "text-black border-gray-800"
    : "text-gray-500 hover:text-black border-transparent";

  return (
    <Link href={props.href}>
      <a className={`flex items-center h-12 px-4 border-b-2 ${colors}`}>
        {props.children}
      </a>
    </Link>
  );
}
export default LayoutHeaderNavigationLink;
