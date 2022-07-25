import jwt from "jsonwebtoken";
import { Request } from "express";
import env from "../utils/environments";

const context = async ({ req }: { req: Request }) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    const parsedData = await jwt.verify(token, env.JWT_SECRET!);
    return parsedData;
  } catch (error: any) {
    return { id: null, message: error?.message };
  }
};

export default context;
