import jwt from "jsonwebtoken";
import { Request } from "express";

const context = async ({ req }: { req: Request }) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    const parsedData = await jwt.verify(token, "Minerva");
    return parsedData;
  } catch (error: any) {
    return error?.message;
  }
};

export { context };
