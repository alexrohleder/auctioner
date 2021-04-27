import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";

const handler = connect<NextApiRequest, NextApiResponse>();

export default handler.get((req, res) => {
  res.json({
    hello: "world",
  });
});
