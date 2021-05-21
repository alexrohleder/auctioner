import { NextApiResponse } from "next";
import ms from "ms";

const cacheRes = (
  res: NextApiResponse,
  age: string,
  revalidate: string = ""
) => {
  const maxAge = ms(age) / 1000;
  const staleWithRevalidate = revalidate ? ms(revalidate) / 1000 : maxAge / 2;

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWithRevalidate}`
  );
};

export default cacheRes;
