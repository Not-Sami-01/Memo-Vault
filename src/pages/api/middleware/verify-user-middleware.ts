import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import type { MiddlewareDataType } from "./applyMiddleware";
export default function verifyUserMiddleware(req: NextApiRequest, res: NextApiResponse<ResponseType>): MiddlewareDataType {
  try {
    const token: any = req.headers.authtoken;
    const verifiedObject = jwt.verify(token, process.env.JWT_SECRET_KEY || 'nothing');
    req.body.user = verifiedObject;
    return { success: true, res, req, status: 200 };
  } catch (error) {
    return { success: false, status:400, error: 'Invalid token', message: 'Authentication failed! AuthToken is invalid!', req, res }
  }

}