import { NextApiRequest, NextApiResponse } from "next";
import type { MiddlewareDataType } from "./applyMiddleware";
import md5 from "md5";
export default function authMiddleware(req: NextApiRequest, res: NextApiResponse<any>): MiddlewareDataType{
  if(req.headers.authtoken === md5(process.env.NEXT_PUBLIC_JWT_KEY || 'ThisThats')){
    return {success: true, status: 200, req, res}
  }else{
    return {success: false, status: 401, error: 'Invalid Token', message: 'Authentication failed! AuthToken is invalid!', req, res}
  }
}